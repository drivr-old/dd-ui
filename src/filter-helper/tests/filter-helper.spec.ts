import FilterModel = ddui.FilterModel;
import FilterHelper = ddui.FilterHelper;

describe('Filter service tests', () => {
    describe('Apply stateParams', () => {

        it('should apply stateParams to filter', () => {
            var filter: FilterModel = {
                'firstName': { value: null },
                'lastName': { value: 'm' },
                'age': { value: 7 },
                'isActive': { value: true }
            };
            var stateParams = {
                'firstName': 'a',
                'lastName': 'm',
                'age': 8,
                'createdAt': '2016-01-01'
            };

            FilterHelper.mergeFilterValues(filter, stateParams);

            expect(filter['firstName'].value).toEqual('a');
            expect(filter['lastName'].value).toEqual('m');
            expect(filter['age'].value).toEqual(8);
            expect(filter['isActive'].value).toEqual(true);
            expect(filter['createdAt']).toBeUndefined();
        });
    });

    describe('Generate state params', () => {
        it('should generate stateParams from filter', () => {
            var filter: FilterModel = {
                'firstName': { value: 'a' },
                'lastName': { value: 'm' },
            };

            var stateParams = FilterHelper.generateStateParams(filter);

            expect(stateParams['firstName']).toEqual('a');
            expect(stateParams['lastName']).toEqual('m');
        });
    });

    describe('Generate dynamic params for state', () => {
        it('creates a state params object from provided objects properties.', () => {
            var obj: FilterModel = {
                'one': {},
                'two': {},
                'anotherProperty': {}
            };

            var result = FilterHelper.generateDynamicParams(obj);

            expect(result).toEqual({
                one: { dynamic: true },
                two: { dynamic: true },
                anotherProperty: { dynamic: true }
            });
        });

        it('can expand extend params on a provided params object.', () => {
            var predefinedParams = {
                predefinedParam: {}
            };

            var obj: FilterModel = {
                'objParam': {}
            };

            var result = FilterHelper.generateDynamicParams(obj, predefinedParams);

            expect(result).toBe(predefinedParams);
            expect(result).toEqual({
                predefinedParam: {},
                objParam: { dynamic: true }
            });
        });
    });

    describe('Generate url params for state', () => {
        it('creates a state URL string containing provided objects properties.', () => {
            var obj: FilterModel = {
                'property1': null,
                'property2': null
            };

            var result = FilterHelper.generateUrlParams(obj);

            expect(result).toEqual('property1&property2');
        });
    });

    describe('generate filter object', () => {
        it('should strip extra properties', () => {
            var filter: FilterModel = {
                'id': { value: 1 },
                'companyId': { value: { id: 5, name: 'Vilnius' } },
                'franchiseId': { value: { id: 6, name: 'Vilnius', title: 'Franchise' }, properties: ['id', 'name'] },
            };

            var result = FilterHelper.generateFilterObject(filter);

            expect(result['id']).toEqual(1);
            expect(result['companyId']).toEqual({ id: 5, name: 'Vilnius' });
            expect(result['franchiseId']).toEqual({ id: 6, name: 'Vilnius' });
        });

        it('should return null for empty filter', () => {
            var filter: FilterModel = { 'id': { value: null } };
            var result = FilterHelper.generateFilterObject(filter);
            expect(result).toEqual(null);
        });
    });

    describe('generate filter request', () => {
        it('should strip extra properties', () => {
            var filter: FilterModel = {
                'id': { value: 1 },
                'companyId': { value: { id: 5, name: 'Vilnius' } },
                'names': { value: ['Jim', 'John'] },
                'franchises': { value: [{ id: 5 }, { id: 6 }, { id: 7 }] },
                'custom': { value: [{ id: 5, name: 'A' }, { id: 6, name: 'B' }], requestFormatter: (value) => value.map(x => x.id) }
            };

            var result = FilterHelper.generateFilterRequest(filter);

            expect(result['id']).toEqual(1);
            expect(result['companyId']).toEqual(5);
            expect(result['names']).toEqual(['Jim', 'John']);
            expect(result['franchises']).toEqual([5, 6, 7]);
            expect(result['custom']).toEqual([5, 6]);
        });
    });

});