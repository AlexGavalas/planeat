import { renderWithUser, screen, within } from '~test/utils';

import { Table, type TableProps } from './table';

describe('<Table />', () => {
    const onDelete = jest.fn();
    const onEdit = jest.fn();

    const props = {
        data: [{ id: 1, key: 'test value 1' }],
        headers: [{ key: 'key', label: 'test label', width: '100%' }],
        onDelete,
        onEdit,
        page: 1,
        totalPages: 1,
    } satisfies TableProps<{ id: number; key: string }>;

    describe('when passed no data', () => {
        it('renders a table', () => {
            renderWithUser(
                <Table {...props} data={[]} headers={[]} totalPages={0} />,
            );

            expect(screen.getByRole('table')).toBeInTheDocument();
            expect(
                within(screen.getByRole('table')).queryAllByRole('cell'),
            ).toHaveLength(0);
        });
    });

    describe('when passed data', () => {
        it('renders a table', () => {
            renderWithUser(<Table {...props} />);

            const table = screen.getByRole('table');
            expect(
                within(table).getByRole('columnheader', { name: 'test label' }),
            ).toBeInTheDocument();
            expect(
                within(table).getByRole('cell', { name: 'test value 1' }),
            ).toBeInTheDocument();
        });
    });
});
