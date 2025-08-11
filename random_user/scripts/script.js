const generateButton = document.querySelector(".generateButton");
const emailElem = document.querySelector("#email");
const phoneElem = document.querySelector("#phone");
const birthdayElem = document.querySelector("#birthday");
const ageElem = document.querySelector("#age");
const profilePictureElem = document.querySelector(".profilePicture");
const nameElem = document.querySelector(".name");
const usernameElem = document.querySelector(".username");

const fetchUser = () => {
        fetch("https://randomuser.me/api/")
        .then(response => response.json())
        .then(data => {
            const user = data.results[0];
            console.log(user);
            const { dob , email , login , name , phone , picture} = user;
            const { large } = picture;
            const { first , last } = name;
            const { username } = login;
            const { age , date } = dob;
    
            console.log(dob , email , login , name , phone , picture);
            console.log(large , first , last , username , age , date);
    
            profilePictureElem.src = large;
            nameElem.innerHTML = `${first} ${last}`;
            usernameElem.innerHTML = username;
            emailElem.value = email;
            phoneElem.value = phone;
            birthdayElem.value = date;
            ageElem.value = age;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

generateButton.addEventListener("click", fetchUser);

window.addEventListener("load" , fetchUser);