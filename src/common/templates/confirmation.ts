import { LINKS } from '../constants'

const confirmation = (email: string, link: string) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <meta charset="utf-8">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
            <title>Subscription successful</title>
            <link href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@400;500;600;700" rel="stylesheet" media="screen">
            <style>
                * {box-sizing: border-box;margin: 0;padding: 0;font-family: 'Montserrat', sans-serif;}
                :root: {-webkit-font-smoothing: antialiased;"}
            </style>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="w-full grid place-items-center break-words">
            <div class="w-full md:w-[800px] p-2 md:p-4">
                <div class="w-full px-4" role="article" aria-roledescription="email" aria-label="Subscription success" lang="en">
                    <p class="font-medium mb-10">Hello ${email}</p>
                    <p class="text-gray-700">
                        You've subscribed to my newsletter. I look forward to sending you updates about the critical and trending updates in web
                        development. <br />
                        If you did not subscribe or this is mistake please, click this link,
                        <a href="${link}" target="_blank" class="underline underline-offset-2">unsubscribe</a>, to unsubscribe.
                    </p>
                    <p class="text-gray-700 mt-20">Kind regards,</p>
                    <p class="text-lg text-gray-500 font-light mb-10">Samson Okunola</p>
                </div>
                <footer class="w-full flex items-center justify-between bg-gray-400 text-xs text-white px-4 py-2">
                    <div class="flex items-center gap-4">
                        ${LINKS.map(({label, url}, index) => (
                            `<a key="${index}" href="${url}" target="_blank">${label}</a>`
                        )).join(" ")}
                    </div>
                    <p>&copy; Copyright${new Date().getFullYear()}</p>
                </footer>
            </div>
        </body>
    </html>
    `
    return html
}

export default confirmation