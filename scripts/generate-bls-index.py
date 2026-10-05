#!/usr/bin/env python3
"""Generate Planeat's compact BLS index without loading the workbook in memory."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any
from xml.etree import ElementTree
from zipfile import ZipFile


CELL_REFERENCE = re.compile(r"([A-Z]+)")
NAMESPACE = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"

# One-based columns from BLS 4.0. Nutrient values are per 100 g edible portion.
COLUMNS = {
    1: "id",
    2: "name",
    3: "englishName",
    7: "calories",
    13: "protein",
    16: "fat",
    19: "carbohydrates",
    22: "fiber",
    121: "salt",
    220: "sugar",
}
TEXT_FIELDS = {"id", "name", "englishName"}


def column_number(reference: str) -> int:
    match = CELL_REFERENCE.match(reference)
    if not match:
        raise ValueError(f"Invalid cell reference: {reference}")

    result = 0
    for character in match.group(1):
        result = result * 26 + ord(character) - ord("A") + 1
    return result


def shared_strings(workbook: ZipFile) -> list[str]:
    values: list[str] = []
    with workbook.open("xl/sharedStrings.xml") as source:
        for _, element in ElementTree.iterparse(source, events=("end",)):
            if element.tag == f"{NAMESPACE}si":
                values.append("".join(node.text or "" for node in element.iter(f"{NAMESPACE}t")))
                element.clear()
    return values


def cell_value(cell: ElementTree.Element, strings: list[str]) -> str | None:
    value = cell.find(f"{NAMESPACE}v")
    if value is None or value.text is None:
        return None
    if cell.get("t") == "s":
        return strings[int(value.text)]
    return value.text


def nutrient_value(value: str | None) -> float | None:
    if not value:
        return None
    try:
        return float(value.replace(",", "."))
    except ValueError:
        # BLS uses markers such as TR, -, <LOQ and <LOD. They mean that a
        # numeric value is unavailable and must not be interpreted as zero.
        return None


def generate(source_path: Path, destination_path: Path) -> int:
    foods: list[dict[str, Any]] = []

    with ZipFile(source_path) as workbook:
        strings = shared_strings(workbook)
        with workbook.open("xl/worksheets/sheet1.xml") as source:
            for _, row in ElementTree.iterparse(source, events=("end",)):
                if row.tag != f"{NAMESPACE}row":
                    continue

                row_number = int(row.get("r", "0"))
                if row_number == 1:
                    row.clear()
                    continue

                food: dict[str, Any] = {}
                for cell in row.findall(f"{NAMESPACE}c"):
                    column = column_number(cell.get("r", ""))
                    field = COLUMNS.get(column)
                    if not field:
                        continue
                    raw_value = cell_value(cell, strings)
                    food[field] = (
                        raw_value.strip()
                        if field in TEXT_FIELDS and raw_value
                        else nutrient_value(raw_value)
                    )

                if food.get("id") and food.get("name"):
                    foods.append({field: food.get(field) for field in COLUMNS.values()})
                row.clear()

    payload = {
        "source": "Bundeslebensmittelschluessel (BLS) 4.0, Max Rubner-Institut (2025)",
        "doi": "10.25826/Data20251217-134202-0",
        "basis": "per 100 g edible portion",
        "foods": foods,
    }
    destination_path.parent.mkdir(parents=True, exist_ok=True)
    destination_path.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    return len(foods)


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: generate-bls-index.py SOURCE.xlsx DESTINATION.json")

    source_path = Path(sys.argv[1])
    destination_path = Path(sys.argv[2])
    count = generate(source_path, destination_path)
    print(f"Generated {destination_path} with {count} foods")


if __name__ == "__main__":
    main()
