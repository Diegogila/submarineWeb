const puppeteer = require("puppeteer");
const readlineSync = require("readline-sync");
const { username, password } = require("./loginType");

const puppeteerConfig = {
  headless: "new",
  ignoreDefaultArgs: ["--disable-extensions"],
  executablePath: "/bin/google-chrome-stable", // Ruta de ejecución de Chrome en WSL
};

(async () => {
  //const numPolicy = readlineSync.question("Numero de poliza: ");

  const browser = await puppeteer.launch(puppeteerConfig);
  const page = await browser.newPage();
  await page.goto("https://www.anaseguros.com.mx/anaweb/");
  await page.click("#Iniciar");
  await page.waitForSelector("#DvLogin > div", { visible: true });

  await login(page);
  await getPolicy(page);

  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
})();

async function getPolicy(page) {
  try {
    await page.locator("#Agentes > div:nth-child(1) > div.four > a").click();
    await page.waitForNavigation();

    await page.type("#CmbBusqueda", "POLIZA");
    await page.type("#TxtBuscar", "3620694");
    await page.locator("#BtnConsultar").click();
    await page.waitForSelector("#DvResultado", { visible: true });
    await page.locator('span[title="IMPRESION"]').click();
    await page.waitForSelector("#FrmResultado", { visible: true });

    const hrefValue = await page.$eval("#FrmResultado > div.f3.stack.animate > div > div > a",(element) => element.getAttribute("href"));
    console.log(hrefValue);
    if (hrefValue) {
      //const pdfPage = await page.browser().newPage();
      await page.goto(hrefValue, { waitUntil: "networkidle0" });
      //await page.pdf({ path: "downloaded_pdf.pdf", format: "A4" });
      //await pdfPage.close();
      console.log("PDF downloaded successfully.");
    } else {
      console.error("PDF link not found.");
    }
  } catch (error) {
    console.warn(`Este es el error: ${error}`);
  }
}

async function login(page) {
  try {
    await page.type("#CmbUsuario", "Agente");
    await page.type("#TxtUsuario", username, { delay: 100 });
    await page.type("#TxtPassword", password, { delay: 100 });
    await page.locator("#BtnEntrar").click();
    await page.waitForNavigation();
  } catch (error) {
    console.error("Este es el error:" + error);
  }
}

function descargarPDF(url) {
  var link = document.createElement("a");
  link.href = url;
  link.target = "_blank"; // Abrir en una pestaña nueva si es necesario
  link.download = "archivo.pdf"; // Nombre del archivo al descargar

  // Simular clic en el enlace
  link.dispatchEvent(new MouseEvent("click"));
}
