# Job Scout

![GitHub repo size](https://img.shields.io/github/repo-size/mancarius/angular-job-search?style=plastic)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/mancarius/angular-job-search?style=plastic)
![GitHub language count](https://img.shields.io/github/languages/count/mancarius/angular-job-search?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/mancarius/angular-job-search?style=plastic)


This project is an angular SPA that allows you to perform a search for a job as Software Developer. You can filter your searches by location or seniority level.

<br/>

## Built With

* [Angular CLI](https://github.com/angular)
* [Tailwind CSS](https://tailwindcss.com)
* [ng-Bootstrap](https://ng-bootstrap.github.io/#/home)
* [Angular Material](https://material.angular.io/)

<br/>

## Installation and usage

<br/>

Download the ZIP or clone the repository on your local machine and run `npm install` inside your local project directory. After that, open the local path `/angular-job-search/src/environments`, create two new files inside this folder and rename them to `environment.ts` and `enviroment.prod.ts`. Now copy and paste this rows in each files:
```javascript
export const environment = {
production: false,
hereApiKey: 'YOUR_APY_KEY',
hereApiEndpoint:
    'https://revgeocode.search.hereapi.com/v1/revgeocode?lang=en-US&'
};
```
Finally, open `enviroment.prod.ts` and edit the line `production: false` in `production: true`.

<br/>

## Credits

* The jobs offers are provided by [The Muse API Service](https://www.themuse.com/developers/api/v2)
* The geocoding service is provided by [Here API Service](https://developer.here.com/)

<br/>

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

<br/>

## License

[MIT](https://choosealicense.com/licenses/mit/)