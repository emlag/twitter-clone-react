## Network

This project mimics a simple social network where users can create and interact with posts. 

#### Dependencies:
* Webpack
* React.js
* Bable
* Django

#### Important Commands to Build project:
1. npm install
2. npm run dev
3. python manage.py runserver

#### Dependencies installed
1. Install webpack: npm i webpack webpack-cli --save-dev
2. Install bable: npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
3. Install React: npm i react react-dom --save-dev


### Known Issues

When a user is not logged in, he can click on the like button for a post. The UI shows the
like as successful because it is optimistic but upon page refresh the server would have
invalidated the like. Ideally this would happen without page refresh, but it doesn't currently.


Sources:
* React + Django: https://www.valentinog.com/blog/drf/#Django_REST_with_React_Django_and_React_together

* Django Models: https://getstream.io/blog/build-a-scalable-twitter-clone-with-django-and-stream/

* React Router: https://www.youtube.com/watch?v=Law7wfdg_ls



