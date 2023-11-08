import {createUserFormData} from './App.tsx'
export const user =  {

    outputMessage: '',

    //create
     createUser(data: createUserFormData) {

        fetch('http://localhost:3333/users', {
          method: 'POST',
          headers:
            { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
          .then(response => { response.json() })
          .catch(error => console.log(error))
          .finally(() => {
             this.outputMessage= JSON.stringify(data, null, 2)
          })
    
      }








}