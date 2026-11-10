const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const fs = require('fs');

(async function testeInterface() {
    // Configurações essenciais para funcionar no Codespaces (Docker/Linux) sem travar
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');
    options.addArguments(`--user-data-dir=/tmp/chrome-${Date.now()}`);
    options.setPageLoadStrategy('eager'); // Evita que o teste trave à espera de imagens

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        console.log('Abrindo site...');
        
        // Utilizando o Google para evitar o bloqueio (ERR_CONNECTION_TIMED_OUT)
        await driver.get('https://www.google.com/');

        // Teste 1: Verificar título da página
        const titulo = await driver.getTitle();
        console.log('Título:', titulo);
        expect(titulo).to.include('Google');

        // Teste 2: Verificar visibilidade da barra de pesquisa
        const barraPesquisa = await driver.findElement(By.name('q'));
        const visivel = await barraPesquisa.isDisplayed();
        console.log('Barra de pesquisa visível?', visivel);
        expect(visivel).to.be.true;

        // Captura de tela
        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync('resultado_teste.png', screenshot, 'base64');
        console.log('Screenshot salvo como resultado_teste.png');

    } catch (err) {
        console.error('Erro no teste:', err);
    } finally {
        await driver.quit();
    }
})();