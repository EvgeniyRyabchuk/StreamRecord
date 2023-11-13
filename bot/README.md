# telegram_bot_jabko

### Описание

Бот предназначен для парсинга сайта с целью анализа цен по сравнению с предыдущим запросом на сканирование. Или автоматическим запросом через интервал времени. 

### Требования 

- Парсинг продуктов по конкретным категориям 
- Запись всех продуктов по всем категориям в бд 


//TODO: pause for avoid spawn block 
//TODO: callback_query read

Heroku 

heroku login
heroku create -a jabkobot 
heroku git:remote -a jabkobot
git push heroku master

heroku ps
heroku ps:scale bot=1
heroku ps:scale web=0
heroku ps:scale worker=1

heroku run bash -a jabkobot
heroku logs -t
curl -F "file=@myfile.csv" https://file.io

npm install --save-dev sequelize-cli
npx sequelize-cli init

npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo

npx sequelize-cli seed:generate --name demo-user
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo 
npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data
npx sequelize-cli db:seed:undo:all
    


https://crontab.guru/every-day

TODO: youtube only stream download 

{
"title": "The Drzj",
"platform": "youtube",
"url": "https://www.youtube.com/@TheDRZJ",
"recording": false
},


{
"title": "JolyGolf YT",
"platform": "youtube",
"url": "https://www.youtube.com/@jolygolf8269",
"recording": false
},