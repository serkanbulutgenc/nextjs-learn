'use server'

import {z} from 'zod'
import {sql} from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { customers } from './placeholder-data'


const FormScheme = z.object({
    id:z.string(),
    customerId: z.string(),
    amount:z.coerce.number(),
    status:z.enum(['pending', 'paid']),
    date:z.string()
})

const CreateInvoice = FormScheme.omit({id:true, date:true})
const UpdateInvoice = FormScheme.omit({id:true, date:true})

export async function createInvoice(formData:FormData){

    const rawFormData = CreateInvoice.parse(Object.fromEntries(formData.entries()))
    const amountInCents = rawFormData.amount * 100
    const date = new Date().toISOString().split('T')[0]

    try {
        await sql `INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${rawFormData.customerId},${amountInCents}, ${rawFormData.status}, ${date})`        
    } catch (error) {
        console.error(`An error occoured when insterting data. ${error}`)
        return {
            message: 'Database Error: Failed to create invoice'
        }
    }

   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices')
    //console.log(rawFormData)
    
}

export async function updateInvoice(id:string, formData:FormData) {
    const rawFormData = UpdateInvoice.parse(Object.fromEntries(formData.entries()))
    const amountInCents = rawFormData.amount * 100 

    try {
        await sql `UPDATE invoices 
        SET customer_id = ${rawFormData.customerId} , amount = ${amountInCents}, status=${rawFormData.status}
        WHERE id=${id}`         
    } catch (error) {
        return {
            message:'Database Error: Failed to updated invoice'
        }
        
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices')
    
}

export async function deleteInvoice(id:string) {
    throw new Error('Failed to delete invoice') 
    try {
        await sql ` DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return {
            message:'Deleted Invoice'
        }
    } catch (error) {
        return {
            message:'Database Error: Failed to delete invoice'
        }
    }
}