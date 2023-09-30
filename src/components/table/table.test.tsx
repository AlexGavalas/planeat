import { renderWithUser } from '~test/utils';

import { Table, type TableProps } from './table';

describe('<Table />', () => {
    const onDelete = jest.fn();
    const onEdit = jest.fn();

    const props = {
        data: [{ id: 1, key: 'test value 1' }],
        headers: [{ key: 'key', label: 'test label', width: '100%' }],
        onDelete,
        onEdit,
        totalPages: 1,
        page: 1,
    } satisfies TableProps;

    describe('when passed no data', () => {
        it('renders a table', () => {
            const { container } = renderWithUser(
                <Table {...props} data={[]} headers={[]} totalPages={0} />,
            );

            expect(container).toMatchSnapshot();
        });
    });

    describe('when passed data', () => {
        it('renders a table', () => {
            const { container } = renderWithUser(<Table {...props} />);

            expect(container).toMatchSnapshot();
        });
    });
});
