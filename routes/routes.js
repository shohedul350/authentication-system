const authRoute = require('./authRoute');
const dashboardRoyte = require('./dashboarRoute');

const routes = [
    {
        path: '/auth',
        handler: authRoute
    },
    {
        path: '/dashboard',
        handler: dashboardRoyte  
    },
    {
        path: '/',
        handler: (req,res)=>{
            res.json({
                message: 'Application Is running'
            })
        }
    }
]

module.exports = app => {
  routes.forEach(r =>{
      if(r.path =='/'){
          app.get(r.path, r.handler)
      }else{
        app.use(r.path, r.handler)
      }
     
  });
}