import FilterModel = ddui.FilterModel;
import FilterHelper = ddui.FilterHelper;

describe('Filter service tests', () => {
    describe('Apply stateParams', () => {

        it('should apply stateParams to filter', () => {
            var filter: FilterModel = {
                'firstName': { value: null },
                'lastName': { value: 'm' },
                'age': { value: 7 },
                'limit': {},
                'isActive': { value: true }
            };
            var stateParams = {
                'firstName': 'a',
                'lastName': 'm',
                'age': 8,
                'limit': 0,
                'createdAt': '2016-01-01'
            };

            FilterHelper.mergeFilterValues(filter, stateParams);

            expect(filter['firstName'].value).toEqual('a');
            expect(filter['lastName'].value).toEqual('m');
            expect(filter['age'].value).toEqual(8);
            expect(filter['isActive'].value).toEqual(true);
            expect(filter['limit'].value).toEqual(0);
            expect(filter['createdAt']).toBeUndefined();
        });
    });

    describe('Generate filter object', () => {
        it('should strip extra properties', () => {
            var filter: FilterModel = {
                'id': { value: 1 },
                'limit': {value: 0},
                'empty': {value: null},
                'companyId': { value: { id: 5, name: 'Vilnius' } },
                'franchiseId': { value: { id: 6, name: 'Vilnius', title: 'Franchise' }, properties: ['id', 'name'] },
            };

            var result = FilterHelper.generateFilterObject(filter);

            expect(result['id']).toEqual(1);
            expect(result['limit']).toEqual(0);
            expect(result['empty']).toBeUndefined();
            expect(result['companyId']).toEqual({ id: 5, name: 'Vilnius' });
            expect(result['franchiseId']).toEqual({ id: 6, name: 'Vilnius' });
        });

        it('should return null for empty filter', () => {
            var filter: FilterModel = { 'id': { value: null } };
            var result = FilterHelper.generateFilterObject(filter);
            expect(result).toEqual(null);
        });
    });

    describe('Generate filter request', () => {
        it('should strip extra properties', () => {
            var filter: FilterModel = {
                'id': { value: 1 },
                'date': {value: new Date('2016-01-01')},
                'companyId': { value: { id: 5, name: 'Vilnius' } },
                'names': { value: ['Jim', 'John'] },
                'franchises': { value: [{ id: 5 }, { id: 6 }, { id: 7 }] },
                'custom': { value: [{ id: 5, name: 'A' }, { id: 6, name: 'B' }], requestFormatter: (value) => value.map(x => x.id) }
            };

            var result = FilterHelper.generateFilterRequest(filter);

            expect(result['id']).toEqual(1);
            expect(result['date']).toEqual(new Date('2016-01-01'));
            expect(result['companyId']).toEqual(5);
            expect(result['names']).toEqual(['Jim', 'John']);
            expect(result['franchises']).toEqual([5, 6, 7]);
            expect(result['custom']).toEqual([5, 6]);
        });

        it('should remove only empty or null or undefined values', () => {
            var filter: ddui.FilterModel = {
                'limit': {value: 25},
                'skip': {value: 0},
                'empty': {value: ''},
                'undf': {value: undefined},
                'nully': {value: null}
            };

            var result = FilterHelper.generateFilterRequest(filter);
            expect(result['limit']).toEqual(25);
            expect(result['skip']).toEqual(0);
            expect(result['empty']).toBeUndefined();
            expect(result['undf']).toBeUndefined();
            expect(result['nully']).toBeUndefined();
        });
    });

});