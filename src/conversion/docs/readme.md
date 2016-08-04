This conversion filter is dedicated to convert distance units to local units.

Default unit system is 'metric'. 
To display meters or kilometers in imperial distance units, use:

```js
conversionService.setUnitSystem('imperial');
```

### Supported units ###

km, m

### Usage ###

```js
    {{"{{ expression | localizedDistance : 'm' }\}"}}
```

Meters will be shown in yards.