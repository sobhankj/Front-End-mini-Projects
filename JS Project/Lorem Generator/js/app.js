const lorem = "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد."

const text_area = document.querySelector("#text_area");
const char = document.querySelector("#char");
const word = document.querySelector("#word");
const paragraph = document.querySelector("#paragraph");

char.addEventListener("input", () => {
    text_area.value = "";
    text_area.value = lorem.split("").filter(char => char !== " ").slice(0, char.value).join("");
    word.value = 0;
    paragraph.value = 0;
})

word.addEventListener("input", () => {
    char.value = 0;
    paragraph.value = 0;
    text_area.value = "";
    j = 0;
    for (let i = 0; i < word.value; i++) {
        if (i > 133) {
            j = i - 133;
        }
        text_area.value += lorem.split(" ").filter(word => word !== " ").slice(j, j+1).join(" ")+ ' ';
        j++;
    }
})

paragraph.addEventListener("input", () => {
    char.value = 0;
    word.value = 0;
    text_area.value = "";
    for (let i = 0; i < paragraph.value; i++) {
        text_area.value += lorem + "\n";
    }
})
