const users = {
    1: {
        name: "Sobhan",
        email: "sobhan@gmail.com",
        phone: "+91 9222222211"
    },
    2: {
        name: "Amit",
        email: "amit@gmail.com",
        phone: "+91 9833333312"
    },
    3: {
        name: "Ravi",
        email: "ravi@gmail.com",
        phone: "+91 9875555513"
    },
    4: {
        name: "Raj",
        email: "raj@gmail.com",
        phone: "+91 9666666614"
    },
    5: {
        name: "Rahul",
        email: "rahul@gmail.com",
        phone: "+91 9876543210"
    }
}

const id = new URLSearchParams(window.location.search).get("id");
const h1 = document.querySelector("h1");
const a = document.querySelector("a");
const p = document.querySelector("p");

h1.textContent = users[id].name;
a.textContent = users[id].email;
p.textContent = users[id].phone;