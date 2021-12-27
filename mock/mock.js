let commonAPIList = {
    "GET /user": {
        "response": {
            "name": "lilonghe",
            "email": "lilonghe@gmail.com",
            "age|1-100": 1,
            "desc": "$desc"
        }
    },
    "GET /list": {
        "response": (req, res) => {
            const pageSize = req.query.pageSize || 10;
            return {
                [`list|1-${pageSize}`]: [{
                    "name": "@cname",
                    "age|1-100": 1,
                    "email": "@email",
                    "desc": "$desc"
                }]
            }
        }
    },
    "GET /project/:id/list": {
        response: {},
    }
}

module.exports = {
    ...commonAPIList,
}