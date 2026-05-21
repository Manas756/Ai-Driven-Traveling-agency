const loginBtn =
   document.getElementById("login-btn");

loginBtn.addEventListener("click", async () => {

   const email =
      document.getElementById("email").value;

   const password =
      document.getElementById("password").value;

   if(!email || !password){
      alert("Fill all fields");
      return;
   }

   const { data, error } =
      await supabaseClient.auth.signInWithPassword({
         email: email,
         password: password
      });

   if(error){
      alert(error.message);
      console.log(error);
      return;
   }

   alert("Login Successful");

   window.location.href = "dashboard.html";
});