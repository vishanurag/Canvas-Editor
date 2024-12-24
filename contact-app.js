// window.addEventListener(
//     "scroll",
//     () => {
//       document.body.style.setProperty(
//         "--scroll",
//         window.pageYOffset / (document.body.offsetHeight - window.innerHeight)
//       );
//     },
//     false
//   );

let homebtn=document.querySelector("#homebtn");

homebtn.addEventListener("click",function(){
    window.location.href="index.html"
})

let topbtn=document.querySelector("#topbtn");

topbtn.addEventListener("click",function(){
    window.location.href="#top";
})
