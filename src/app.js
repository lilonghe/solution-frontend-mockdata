import React, { useEffect, useState } from 'react';

const App = () => {
    const [user, setUser] = useState();

    useEffect(() => {
        fetch('/mock/user').then(res=>res.json()).then(res=> {
            if (res) {
                setUser(res);
            }
        });
    }, []);

    return <div>
        Hello, {user?.name}
    </div>
}

export default App;