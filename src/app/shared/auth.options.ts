export const Options = {

  additionalSignUpFields: [{
    name: "name",                              // required
    placeholder: "enter your name",            // required
    // icon: "", // optional
    validator: function(value) {                  // optional
      // only accept addresses with more than 10 characters
      return value.length > 10;
    }
  }],

  theme: {
    logo: "../../assets/logo.png",
    primaryColor: "#b81b1c"
  },

  languageDictionary: {
    title: "Task Manager"
  },

  rememberLastLogin: false,

  auth: {
    redirect: false
  },

  avatar: null,

  autoclose: true,

  allowSignUp: false,



}
