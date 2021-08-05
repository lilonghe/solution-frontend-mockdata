# Mock Data
dynamic url and dynamic mock data.  
just need edit `mock/mock.json` file, then all requests starting with `/mock` will be forwarded to mock server.

# Demo
```
// app.js
fetch('/mock/user').then(res=>res.json()).then(res=> {
    if (res) {
        setUser(res);
    }
});

// mock.json
{
    "GET /user": {
        "response": {
            "name": "lilonghe",
            "email": "lilonghe@gmail.com"
        }
    }
}
```