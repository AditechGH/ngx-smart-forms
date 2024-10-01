import { THEMES } from './themes';

// Define the configuration interface for flexibility in controlling behavior
interface StyleUtilConfig {
  cacheEnabled?: boolean; // Toggle caching on or off
  stylePriority?: Array<'theme' | 'class' | 'custom'>; // Set priority order of style sources
  errorHandler?: (error: unknown, styleSheetHref?: string) => void; // Custom error handler function
}

// Default configuration settings for the utility
const defaultConfig: StyleUtilConfig = {
  cacheEnabled: true,
  stylePriority: ['theme', 'class', 'custom'],
  errorHandler: (error, styleSheetHref) => {
    console.warn('Cannot access stylesheet:', styleSheetHref, error);
  },
};

// Cache to store extracted styles for class names
const styleCache: { [key: string]: { [key: string]: string } } = {};

/**
 * Merges styles from a specified theme, class, and any custom styles provided.
 *
 * @param themeName - The name of the theme to retrieve styles from (e.g., 'light', 'dark').
 * @param className - The class name(s) applied to the element for additional styling. Overrides theme styles.
 * @param customStyles - An object containing custom inline styles that will override both theme and class styles.
 * @param config - Configuration options to control caching, style source priority, and error handling.
 * @returns An object containing the merged styles with the specified precedence order.
 */
export function getMergedStyles(
  themeName: string,
  className: string | null,
  customStyles: { [key: string]: string } = {},
  config: StyleUtilConfig = defaultConfig
): { [key: string]: string } {
  // Retrieve base theme styles if no class styles are specified
  const themeStyles = THEMES[themeName] || {};

  // Handle multiple classes if provided, merge extracted styles
  const classStyles = className
    ? mergeMultipleClassStyles(className.split(' '), config)
    : {};

  // Determine the order of merging based on the config priority
  const styles = {
    theme: themeStyles,
    class: classStyles,
    custom: customStyles,
  };

  // Merge styles based on the configured priority
  const mergedStyles = config.stylePriority?.reduce(
    (acc, key) => ({ ...acc, ...styles[key] }),
    {}
  );

  return mergedStyles || {};
}

/**
 * Merges styles from multiple classes, ensuring later classes override earlier ones.
 * Caches results to improve performance for frequently used classes.
 *
 * @param classNames - An array of class names to extract and merge styles from.
 * @param config - Configuration options that control caching and error handling.
 * @returns An object containing the merged CSS properties and values from all specified classes.
 */
function mergeMultipleClassStyles(
  classNames: string[],
  config: StyleUtilConfig
): { [key: string]: string } {
  return classNames.reduce((acc, className) => {
    // Use caching if enabled
    if (config.cacheEnabled && styleCache[className]) {
      return { ...acc, ...styleCache[className] };
    }

    // Extract styles for the class and cache if enabled
    const extractedStyles = extractStylesFromClass(`.${className}`, config);
    if (config.cacheEnabled) {
      styleCache[className] = extractedStyles;
    }

    return { ...acc, ...extractedStyles };
  }, {});
}

/**
 * Extracts styles from the specified class name by accessing document style sheets.
 * Handles large projects efficiently by caching results and handling errors gracefully.
 *
 * @param className - The class name (e.g., '.error') whose styles you want to extract.
 * @param config - Configuration options that control error handling.
 * @returns An object containing the extracted CSS properties and their values.
 */
function extractStylesFromClass(
  className: string,
  config: StyleUtilConfig
): { [key: string]: string } {
  const extractedStyles: { [key: string]: string } = {};
  const styleSheets = Array.from(document.styleSheets);

  // Iterate through each style sheet
  styleSheets.forEach((styleSheet) => {
    // Some style sheets may not be accessible due to CORS policies; use error handler if set
    try {
      const cssRules = styleSheet.cssRules || styleSheet.rules; // Get CSS rules

      // Iterate through each rule in the style sheet
      Array.from(cssRules).forEach((rule: CSSRule) => {
        // Check if the rule is a style rule and matches the class name
        if (
          rule instanceof CSSStyleRule &&
          rule.selectorText.includes(className)
        ) {
          // Extract styles from the matched rule
          for (let i = 0; i < rule.style.length; i++) {
            const propertyName = rule.style[i];
            const propertyValue = rule.style.getPropertyValue(propertyName);
            extractedStyles[propertyName] = propertyValue;
          }
        }
      });
    } catch (error) {
      // Use the custom error handler defined in the configuration
      config.errorHandler?.(error, styleSheet.href || '');
    }
  });

  return extractedStyles;
}
