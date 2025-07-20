const Quotes = [
    {
        quote: "من هیچ استعداد خاصی ندارم. فقط از روی علاقه کنجکاوم.",
        author: "آلبرت انیشتین"
    },
    {
        quote: "آرام و هوشمندانه. آنان که سریع می دوند، سکندری می خورند.",
        author: "ویلیام شکسپیر"
    },
    {
        quote: "اگر درباره مردم قضاوت کنید، دیگر فرصتی برای دوست داشتن آنها ندارید",
        author: "مادر ترزا"
    },
    {
        quote: "هر وقت خود را در میان اکثریت دیدید، وقت آن رسیده است که مکث کنید و تأمل کنید. ",
        author: "مارک تواین"
    },
    {
        quote: "ما نتیجه اندیشه‌مان هستیم.",
        author: "بودا"
    },
    {
        quote: "هنوز هم شجاعانه ترین کار این است که خودتان فکر کنید. آن هم با صدای بلند.",
        author: "کوکو شنل"
    },
    {
        quote: "گرسنه بمانید، احمق بمانید.",
        author: "استیو جابز"
    },
    {
        quote: "جنون یعنی تکرار مداوم یک کار و انتظار کشیدن برای نتایج متفاوت.",
        author: "آلبرت انیشتین"
    },
    {
        quote: "بزرگترین ثروت این است که بتوانید با چیزهای کوچک راضی و قانع زندگی کنید",
        author: "افلاطون"
    },
    {
        quote: "آینده متعلق به کسانی است که امروز خود را برای آن آماده می کنند.",
        author: "مالکوم ایکس"
    },
    {
        quote: "جنگجوی موفق انسان متوسطی است که مثل لیزر تمرکز می کند.",
        author: "بروس لی"
    },
]


const quote_text = document.querySelector(".quote_text");
const author_text = document.querySelector(".author_text");

const random_quote = Math.floor(Math.random() * Quotes.length);

quote_text.textContent = Quotes[random_quote].quote;
author_text.textContent = Quotes[random_quote].author;