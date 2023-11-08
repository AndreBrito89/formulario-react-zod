//import { useState } from 'react';
import './assets/styles/global.css';
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { user } from './user.tsx';
//  TODO:
// ->CRIAR ARQUIVO USER PARA IMPLEMENTAÇÃO DE METODOS POST/GET/DELETE/UPDATE
// ->IMPLEMENTAR CLASSE USER 
// ->INTEGAR CLASSE USER AO BACK-END


/////////////////////////////////////////////
//TRATAMENTO DE VARIAVEIS UTILIZANDO O ZOD//
///////////////////////////////////////////
const createUserFormSchema = z.object({
  //TRATAMENTO NOME
  name: z.string().min(1, 'Nome obrigatorio')
    //deprecated
    //.nonempty('Nome obrigatorio')
    //exemplo de tratamento basico
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ')
    }),
  //TRATAMENTO EMAIL
  email: z.string().min(1, 'E-mail obrigatorio')
    .email('Formato de e-mail invalido').toLowerCase()
    .refine(email => {
      return email.endsWith('@pepegamail.com')
    }, 'O email precisa ser da pepegamail.com'),
  //TRATAMENTO SENHA
  password: z.string()
    .regex(new RegExp('.*[A-Z].*'), 'Necessita caractere maisculo')
    .regex(new RegExp('.*[a-z].*'), 'Necessita caractere minusculo')
    .regex(new RegExp('.*\\d.*'), 'Necessita um numero')
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      'Necessita um caractere especial'
    )
    .min(6, 'Senha necessita no minimo 6 caracteres'),
  animais: z.array(z.object({
    name: z.string().min(1, 'Animal invalido'),
    animal: z.string().min(1, 'Animal invalido'),
    age: z.coerce.number().max(50, 'Opa! Tem certeza que seu pet tem mais de 50 anos?')
  }))

})


//usa a funcao infer do zod para passar os tipos dos campos para usar o createUserFormData
export type createUserFormData = z.infer<typeof createUserFormSchema>

////////////
/// APP ///
//////////
export function App() {
  //associa os dados do input a um estado
  //const [output, setOutput] = useState('')
  //registra os campos do formulario
  const { register,
    handleSubmit,
    //analiza o estado do formulario para atualizar erros em tempo real
    formState: { errors },
    control
    //passa os tipos dos campos do formulario para a funcao useForm
  } = useForm<createUserFormData>({
    //usa o zod para validacoes do formulario
    resolver: zodResolver(createUserFormSchema)
  })
  //fields=>campos
  //append=>adiciona campo
  //remove=>remove campo
  const {fields, append} = useFieldArray({
    control,
    name: 'animais',
  })


  function addNewPet() {
    append({ name: '', animal: '', age: 0 })
  }
  /////////////////////
  ///PAGINA GERADA ///
  ///////////////////
  return (
    //h-screen = ocupar a tela toda
    <main className='h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center'>

      <form
        onSubmit={handleSubmit(user.createUser)}
        className='flex flex-col gap-4 w-full max-w-xs'>
        <div className='flex flex-col gap-1'>
          <label htmlFor=''>Name:</label>
          <input
            type='text'
            className='border border-zinc-200 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white'
            {...register('name')}
          />
          {errors.name && <span className='text-red-600'>{errors.name.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor=''>E-mail:</label>
          <input
            type='email'
            className='border border-zinc-200 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white'
            {...register('email')}
          />
          {errors.email && <span className='text-red-600'>{errors.email.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor=''>Password:</label>
          <input
            type='password'
            className='border border-zinc-200 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white'
            {...register('password')}
          />
          {errors.password && <span className='text-red-600'>{errors.password.message}</span>}
        </div>


        <div className='flex flex-col gap-1'>
          <label htmlFor="" className='flex items-center justify-between'>
            Animais de Estimacao
            <button type='button' onClick={addNewPet} className='text-emerald-500 h-8 hover:text-purple-500'>
              Adicionar Pet
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div className='flex gap-2' key={field.id}>
                <div className='flex flex-1 flex-col gap-1'>
                  <input
                    type='text'
                    className='border border-zinc-200 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white'
                    placeholder='Nome'
                    {...register(`animais.${index}.name`)}
                  />
                  {errors.animais?.[index]?.name && <span className='text-red-600'>{errors.animais[index]?.name?.message}</span>}
                </div>

                <div className='flex flex-col gap-1'>
                  <input
                    type='text'
                    className='border border-zinc-200 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white'
                    placeholder='Raca'
                    {...register(`animais.${index}.animal`)}
                  />
                  {errors.animais?.[index]?.animal && <span className='text-red-600'>{errors.animais[index]?.animal?.message}</span>}
                </div>
                <div className='flex flex-col gap-1'>
                  <input
                    type='number'
                    className='border border-zinc-200 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white'
                    placeholder='Idade'
                    {...register(`animais.${index}.age`)}
                  />
                  {errors.animais?.[index]?.age && <span className='text-red-600'>{errors.animais[index]?.age?.message}</span>}
                </div>
              </div>
            )
          })}
        </div>





        <button
          type='submit'
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-cyan-500">
          Salvar
        </button>


      </form>

      <pre>{user.outputMessage}</pre>

    </main>
  )
}


