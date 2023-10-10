import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ url }) {
   
    if (url.searchParams.has('tgWebAppStartParam')) {
        const id = url.searchParams.get('tgWebAppStartParam')
        console.log('tgWebAppStartParam',id)
        throw redirect(308, `/lots/${id}`)
    }
}