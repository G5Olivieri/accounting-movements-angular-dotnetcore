# accounting-movements-angular-dotnetcore
Simple Accounting Movements web app using Angular and Dotnet Core

A study purpose app to I to learn AngularJS and rxjs.

# Backend

A simple dotnet core web API, there are two CRUDs, movements and permanentmovements,
and a very simple authentication management using username/password pair authentication method.
The session is managed by JWT, and access control is a simple owner access control, where only
the resource owner can be create, read, update and delete the resources.

There isn't any business rules implemented in backend all of the app is in frontend.

# Frontend

A SPA written in typescript using Angular Framework.

The UI was built using Angular Material.

There is only one module, the movements module.

The movements module is responsable for entire app.
