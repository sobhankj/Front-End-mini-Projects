// let number1 = +prompt("Enter number one :" , "0");
// let number2 = +prompt("Enter number two :" , "0");
// let number3 = +prompt("Enter number three :" , "0");

//! tamrin 1 //
// let add = number1 + number2;
// let sub = number1 - number2;
// let mult = number1 * number2;
// let div = number1 / number2;
// alert(add)
// alert(sub)
// alert(mult)
// alert(div)

//! tamrin 2 //
// let count = number1 * (100 - number2) / 100;
// alert(count)

//! tamrin 3 //
// if (number1 % 2 === 0) {
//     alert("even")
// } else {
//     alert("odd")
// }

//! tamrin 4 //
// let avg = (number1 + number2 + number3) / 3;
// alert(avg);

//! tamrin 5 //
// if (number1 >= 18) {
//     alert("OK")
// } else {
//     alert("You Can't login")
// }

//! tamrin 6 //
// let tavan = number1 ** number2;
// alert(tavan);

//1 tamrin 7 //
// let now = 2025;
// alert("your age is: " + (now - number1));

//! tamrin 8 //
// alert("hour: " + Math.trunc(number1/60) + "\n" + "minute: " + (number1 % 60));

//! tamrin 9 //
// if (number1 > 20 || number1 < 0 || isNaN(number1)) {
//     alert("this grade is invalid!");
// } else if (number1 > 15){
//     alert("grade A");
// } else if (number1 > 12) {
//     alert("grade B");
// } else {
//     alert("grade C");
// }

//! tamrin 10 //
// switch (true) {
//     case number1 > 20 || number1 < 0 || isNaN(number1):
//         alert("this grade is invalid!");
//         break;

//     case number1 >= 15 :
//         alert("grade A");
//         break;
    
//     case number1 >= 12 :
//         alert("grade B");
//         break;
    
//     default :
//         alert("grade C");
// }

//! tamrin 11 //
// function sum(number1=0 , number2=0) {
//     alert("sum= " + (number1 + number2));
//     return number1 + number2;
// }
// sum(1 , 3);

//! tamrin 12 //
// let num = +prompt("enter your number" , 0);
// function check(number=0) {
//     if (number % 2 === 0) {
//         alert("number " + number + " is even");
//         retrun "even";
//     } else {
//         alert("number " + number + " is odd");
//         retrun "odd";
//     }
// }
// check(num);

//! tamrin 13 //
// let num1 = +prompt("number one");
// let num2 = +prompt("number two");
// let num3 = +prompt("number three");
// function avg(number1=0 , number2=0 , number3=0) {
//     let res = (number1 + number2 + number3)/3;
//     rerurn res;
//     alert("avg " + number1 + " " + number2 + " " + number3 + " is " + res);
// }
// avg(num1 , num2 , num3);

//! tamrin 14 //
// let username = prompt("enter your username: ");
// let password = prompt("enter your password");

//! tamrin 15 //
// function checkSignUp(username , password) {
//     if (username.length < 4 || password.length < 8) {
//         return false;
//     } else {
//         return true;
//     }
// }

//! tamrin 16 //
// let check = checkSignUp(username , password);
// if (check) {
//     alert("your sign up is successful");
// } else {
//     alert("your sign up is failed");
// }

//! tamrin 17 //
// let ok_user = "ali";
// let enter_user = prompt("enter your username");
// if (enter_user.toLowerCase() === ok_user) {
//     alert("You Loged in");
// } else {
//     alert("you cant enter this site");
// }

//! tamrin 18 //
// let sentence = prompt("enter your sentece");
// let word = prompt("enter your word");
// if (sentence.indexOf(word) !== -1) {
//     alert("this word is in sentece.");
// } else {
//     alert("this word is not in sentece");
// }

//! tamrin 19 //
// let address = prompt("enter your domain adsress");
// if (address.startsWith("https")) {
//     alert("this is safe web");
// } else {
//     alert("this isn't safe");
// }

//! tamrin 20 //
// let capcha = Math.floor(Math.random() * 100000);
// let code = +prompt("enter this capcha code " + capcha);
// if (code === capcha && code !== NaN) {
//     alert("you can enter");
// } else {
//     alert("code is incorrect!");
// }

//! tamrin 21 //
// for (let index = 0; index < 101; index+=2) {
//     console.log(index);
// }

//! tamrin 22 //
// let total = 0;
// for (let i = 0; i < 5; i++) {
//     let user_input = +prompt("enter your product price" , 0);
//     if (Number.isNaN(user_input)) {
//         console.log("enter nan");
//     } else {
//         total += user_input;
//         console.log(total , user_input);
//     }
// }
// console.log(total);
// alert("your total price is " + total);

//! tamrin 23 //
// let total = 0;
// for (let i = 0; i < 5; i++) {
//     let user_input = +prompt("enter your number" , 0);
//     if (Number.isNaN(user_input)) {
//         console.log("enter nan");
//     } else {
//         total += user_input;
//         console.log(total , user_input);
//     }
// }
// console.log(total/5);
// alert("your avg of 5 number is " + total/5);

//! tamrin 24 //
// let number = +prompt("enter your number", 0);
// if (Number.isNaN(number)) {
//     alert("your input is not a number");
// } else {
//     let Snumber = number.toString();
//     alert("length of your number is " + Snumber.length);
// }

//! tamrin 25 //
// let user_number = +prompt("enter your number" , 0);
// if (Number.isNaN(user_number)) {
//     alert("your input is not a number");
// } else {
//     let total = 0;
//     while (user_number >= 1) {
//         total += user_number % 10;
//         user_number /= 10;
//         user_number = Math.floor(user_number);
//         console.log(total , user_number);
//     }
//     alert("sum of your index of number is " + total);
// }

//! tamrin 26 //
// let num1 = +prompt("enter num 1" , 0);
// let num2 = +prompt("enter num 2" , 0);
// if (Number.isNaN(num1) || Number.isNaN(num2)) {
//     alert("your input is not a number");
// } else {
//     if (num1 > num2) {
//         [num1, num2] = [num2, num1];
//     }
//     if (num1 % 2 !== 0) {
//         num1++;
//     }
//     for (let i = num1; i <= num2; i+=2) {
//         console.log(i)
//     }
// }

//! tamrin 27 //
// let sum = 0;
// let num = 0;
// while (true) {
//     let user_input = +prompt("enter your number if you want to stop it enter 0 or neg number" , 0);
//     if (Number.isNaN(user_input)) {
//         alert("your input is not a number");
//     } else {
//         if (user_input <= 0) {
//             break;
//         }
//         sum += user_input;
//         num++;
//     }
// }
// alert("sum of your number = " + sum + "\navg of your number = " + sum/num);

//! tamrin 28 //
// function pow (number , pow) {
//     if (pow === 0) {
//         return 1;
//     }
//     for (let i = 0; i < pow - 1; i++) {
//         number *= number;
//     }
//     return number;
// }

//! tamrin 29 //
// let num_list = new Array();
// while (true) {
//     let user_input = +prompt("enter your number if you want to stop it enter 0 or neg number" , 0);
//     if (Number.isNaN(user_input)) {
//         alert("your input is not a number");
//     } else {
//         if (user_input <= 0) {
//             break;
//         }
//         num_list.push(user_input);
//     }
// }
// let sum = 0;
// for (let i = 0; i < num_list.length; i++) {
//     sum += num_list[i];
// }
// alert("sum of your number = " + sum + "\navg of your number = " + sum/num_list.length);

// tamrin 30 //
// let users = [
//     {id : 1 , first_name : "sobhan" , last_name : "kooshki" , age : 21 , gmail : "sobhan.kooshki2233@gmail.com"},
//     {id : 2 , first_name : "kian" , last_name : "kooshki" , age : 19 , gmail : "kian.kooshki2233@gmail.com"},
//     {id : 3 , first_name : "reza" , last_name : "zibandeh" , age : 22 , gmail : "MRZ@gmail.com"}
// ]
// let f_name = prompt("Enter your first Name : ");
// let l_name = prompt("Enter your Last Name : ");
// let age_u = +prompt("Enter your age : ");
// let gmail_u = prompt("Enter your gmail : ");
// let isOk = true;
// if (f_name.length < 3 || f_name.length > 10) {
//     alert("your first name is hit the limit");
//     isOk = false;
// }
// if (l_name.length < 3 || l_name.length > 15) {
//     alert("your last name is hit the limit");
//     isOk = false;
// }
// if (Number.isNaN(age_u) || age_u < 18) {
//     alert("you are under 18\nyou cant signup");
//     isOk = false;
// }
// if (!gmail_u.endsWith("@gmail.com")) {
//     alert("your gmail is not correct");
//     isOk = false;
// }
// let new_user = { id : users.length+1 , first_name : f_name , last_name : l_name , age : age_u , gmail : gmail_u};
// if (isOk) {
//     users.push(new_user);
// }
// console.log(users);

//! tamrin 31 //
// let users = [
//     {id : 1 , first_name : "sobhan" , last_name : "kooshki" , age : 21 , gmail : "sobhan.kooshki2233@gmail.com"},
//     {id : 2 , first_name : "kian" , last_name : "kooshki" , age : 19 , gmail : "kian.kooshki2233@gmail.com"},
//     {id : 3 , first_name : "reza" , last_name : "zibandeh" , age : 22 , gmail : "MRZ@gmail.com"}
// ]
// users.forEach(function(user) {
//     console.log("[id: " + user.id + " first_name: " + user.first_name + " age: " + user.age + " gmail: " + user.gmail + "]");
// });

//! tamrin 32 //
// let products = [
//     {id : 1 , name : "apple" , price : 100 , count : 2},
//     {id : 2 , name : "water" , price : 200 , count : 2},
//     {id : 3 , name : "orange" , price : 300 , count : 2}
// ]
// let bascket = [
//     {id : 1 , name : "1" , price : 500},
//     {id : 2 , name : "2" , price : 600},
//     {id : 3 , name : "3" , price : 700}
// ];
// let product_name = prompt("Enter product name which you want to add to your bascket");
// products.forEach(function(product) {
//     if (product.name === product_name && product.count > 0) {
//         let new_product = {id : bascket.length + 1 , name : product_name , price : product.price};
//         bascket.push(new_product);
//         return;
//     }
// });
// console.log(bascket);
// let sum = 0;
// bascket.forEach(function (product) {
//     sum += product.price;
// });
// alert("sum of price: " + sum);

//! tamrin 33 //
// let users = [
//     {id : 1 , first_name : "sobhan" , age : 21},
//     {id : 2 , first_name : "kian" , age : 4},
//     {id : 3 , first_name : "reza" , age : 22}
// ]
// let isAllOk = users.every(function (user) {
//     return user.age > 18;
// });
// if (isAllOk) {
//     alert("ok call will start soon...");
// } else {
//     alert("at least one person is under than 18");
// }

//! tamrin 34 //
// let users = [
//     {id : 1 , username : "sobhan" , password : "123456"},
//     {id : 2 , username : "kian" , password : "abcd"},
//     {id : 3 , username : "reza" , password : "poiuy1234"}
// ]
// let inp_username = prompt("enter your username for reset your password");
// let user_info = users.find(function(user) {
//     return user.username === inp_username;
// });
// if (user_info === undefined) {
//     alert("we cant find this username");
// } else {
//     alert("your password is : " + user_info.password);
// }

//! tamrin 35 //
// let products = [
//     {id : 1 , name : "apple" , price : 100 , count : 2},
//     {id : 2 , name : "water" , price : 200 , count : 2},
//     {id : 3 , name : "orange" , price : 300 , count : 2}
// ]
// let bascket = [
//     {id : 1 , name : "1" , price : 500},
//     {id : 2 , name : "2" , price : 600},
//     {id : 3 , name : "3" , price : 700}
// ];
// let option = prompt("you have two option\n1)add product\n2)delet product");
// if (option === "add") {
//     let product_name = prompt("enter product name which you want to add in your bascket");
//     products.forEach(function(product) {
//         if  (product.name === product_name && product.count > 0) {
//             let new_product = {id : bascket.length + 1 , name : product_name , price : product.price};
//             bascket.push(new_product);
//         }
//     });
//     alert("you add " + product_name + " to your bascket");
//     console.log(bascket);
// } else if (option === "delet") {
//     let product_name = prompt("enter product name which you want to delet in your bascket");
//     let index = bascket.findIndex(function (product) {
//         return product.name === product_name;
//     });
//     bascket.splice(index , 1);
//     alert("you delet " + product_name + " from your bascket");
//     console.log(bascket);
// } else {
//     alert("option doesn't exist");
// }

//! tamrin 36 //
// let products = [
//     {id : 1 , name : "apple is the best" , price : 100 , count : 2},
//     {id : 2 , name : "water" , price : 200 , count : 2},
//     {id : 3 , name : "orange and apple has a lot of vitamin" , price : 300 , count : 2}
// ]
// let item_search = prompt("enter your search item");
// let filtered_list = products.filter(function (product) {
//     return product.name.includes(item_search);
// });
// console.log(filtered_list);

//! tamrin 37 //
// let bascket = [
//     {id : 1 , name : "1" , price : 500},
//     {id : 2 , name : "2" , price : 600},
//     {id : 3 , name : "3" , price : 700},
//     {id : 4 , name : "4" , price : 800},
//     {id : 5 , name : "5" , price : 900},
//     {id : 6 , name : "6" , price : 1000},
// ];
// let bascket_after_tax = bascket.map(function(product) {
//     if (product.price > 750) {
//         return product.price;
//     } else {
//         return product.price + 100;
//     }
// });
// console.log(bascket_after_tax);
// let sum = 0;
// bascket_after_tax.forEach(function (price) {
//     sum += price;
// });
// alert("your total cost is : " + sum);

//! tamrin 38 //
// let input = prompt("enter your word");
// console.log("input " + input);
// let reverse_input_array = [];
// for (let i = input.length; i >= 0; i--) {
//     reverse_input_array.push(input[i]);
// }
// console.log("reverse array" , reverse_input_array);
// let reverse_input = reverse_input_array.join("");
// console.log("reverse " + reverse_input);
// if (reverse_input === input) {
//     alert(input + " is reverse word");
// } else {
//     alert("they aren't reverse word!");
// }

//! tamrin 39 //
// let toDoList = [
//     {id : 1 , name : "1" , isFinish : false},
//     {id : 2 , name : "2" , isFinish : false},
//     {id : 3 , name : "3" , isFinish : false}
// ]
// let option;
// while (option !== "4") {
//     option = prompt("1) add todo\n2) delet todo\n3) end todo");
//     if (option === "1") {
//         let name_todo = prompt("enter the name of your todo");
//         toDoList.push({id : toDoList.length + 1 , name : name_todo , isFinish : false});
//         console.log(toDoList);
//         console.log("todo is added");
//     } else if (option === "2"){
//         let name_todo = prompt("enter the name of your todo");
//         let index = toDoList.findIndex(function(todo) {
//             return todo.name === name_todo;
//         });
//         toDoList.splice(index , 1);
//         console.log(toDoList);
//         console.log("todo is deleted");
//     } else if (option === "3") {
//         let name_todo = prompt("enter the name of your todo");
//         let index = toDoList.findIndex(function(todo) {
//             return todo.name === name_todo;
//         });
//         toDoList.at(index).isFinish = true;
//         console.log(toDoList);
//         console.log("todo is finished");
//     } else if (option === "4") {
//         break;
//     } else {
//         alert("your input is wrong\ntry again.");
//     }
// }

//! tamrin 40 //
// let toDoList = [
//     {id : 1 , name : "sobhan" , works : []},
//     {id : 2 , name : "kian" , works : []},
//     {id : 3 , name : "reza" , works : []}
// ]
// let name_memeber = prompt("enter the name");
// let work = prompt("enter the work");
// toDoList.some(function (member) {
//     if (member.name === name_memeber) {
//         member.works.push(work);
//         return true;
//     }
// });
// console.log(toDoList);

//!tamrin 41 //
// let questions = [
//     {qustion_ : "Q1" , options : ["a" , "b" , "c" , "d"] , rAnwser : "a"},
//     {qustion_ : "Q2" , options : ["a" , "b" , "c" , "d"] , rAnwser : "b"},
//     {qustion_ : "Q3" , options : ["a" , "b" , "c" , "d"] , rAnwser : "c"}
// ]
// let score = 0;
// questions.forEach(function (qustion) {
//     let user_aws = prompt("awnser this question\n" + qustion.qustion_ +"\n"+ qustion.options.join("\n"));
//     if (user_aws === qustion.rAnwser) {
//         score++;
//     }
// });
// alert("your score is " + score);

//! tamrin 42 //
// let num1 = +prompt("enter first number");
// let num2 = +prompt("enter second number");
// let operation = prompt("enter operation");
// switch (operation) {
//     case "*":
//         alert(`= ${num1*num2}`);
//         break;

//     case "/" :
//         alert(`= ${num1/num2}`);
//         break;
    
//     case "+" :
//         alert(`= ${num1+num2}`);
//         break;

//     case "-" :
//         alert(`= ${num1-num2}`);
//         break;
    
//     default :
//         alert("undifind operation");
// }

//! tamrin 43 //
// let min = +prompt("min = ");
// let sec = +prompt("sec = ");
// let timer = setInterval(function(){
//     console.log(min , sec);
//     if (min === 0 && sec === 0) {
//         clearInterval(timer);
//     }
//     sec--;
//     if (sec < 0) {
//         sec = 59;
//         min--;
//     }
// } , 1000);

//! tamrin 44 //
let isFill = 0;
isFill = +prompt("set it");
setTimeout(function(isFill) {
    if (isFill === 0) {
        console.log("you have to set pic for your profile");
    }else {
        console.log("is ok");
    }
} , 5000 , isFill);