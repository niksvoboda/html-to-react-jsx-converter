const fs = require("fs");

/**
 * Конвертирует строку inline CSS в объект JSX style.
 * @param {string} cssString - Строка CSS.
 * @returns {string} - Строка стилей в синтаксисе JSX.
 */
function convertInlineCssToJsxStyle(cssString) {
  const styleObject = {};
  cssString.split(";").forEach((rule) => {
    const [property, value] = rule.split(":").map((str) => str.trim());
    if (property && value) {
      const camelCaseProperty = property.replace(/-([a-z])/g, (match, letter) =>
        letter.toUpperCase()
      );
      styleObject[camelCaseProperty] = value;
    }
  });
  
  return JSON.stringify(styleObject).replace(/"([^"]+)":/g, "$1:").replace(/"/g, "'");
}

/**
 * Преобразует HTML с инлайновыми стилями в формат React JSX.
 * @param {string} htmlString - Строка HTML.
 * @returns {string} - Исправленный HTML с преобразованными стилями.
 */
function convertHtmlInlineStylesToJsx(htmlString) {
  return htmlString.replace(/style="([^"]*)"/g, (_, cssString) => {
    const jsxStyle = convertInlineCssToJsxStyle(cssString);
    return `style={${jsxStyle}}`;
  });
}

/**
 * Считывает HTML из файла, преобразует стили и сохраняет результат.
 * @param {string} inputFilePath - Путь к исходному файлу HTML.
 * @param {string} outputFilePath - Путь к исправленному файлу HTML.
 */
function processFile(inputFilePath, outputFilePath) {
  try {
    // Считывание HTML из входного файла.
    const htmlString = fs.readFileSync(inputFilePath, "utf8");
    console.log("Исходный HTML:");
    console.log(htmlString);

    // Преобразование HTML с инлайновыми стилями.
    const updatedHtmlString = convertHtmlInlineStylesToJsx(htmlString);

    // Запись исправленного HTML в выходной файл.
    fs.writeFileSync(outputFilePath, updatedHtmlString, "utf8");
    console.log(`Изменённый HTML сохранён в файл: ${outputFilePath}`);
  } catch (error) {
    console.error("Ошибка при обработке файла:", error);
  }
}

// Пример использования:
// Укажи пути к входному и выходному файлам.
const inputFilePath = "input.jsx";
const outputFilePath = "output.jsx";

// Запуск обработки файла.
processFile(inputFilePath, outputFilePath);