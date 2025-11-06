/**
 * Utilidad para cargar traducciones de manera reutilizable
 * Evita duplicar código en cada componente
 */

interface Translations {
  [key: string]: any;
}

/**
 * Carga las traducciones para el idioma especificado
 * @param locale - El código del idioma (ej: 'es', 'en')
 * @param astroContext - El contexto de Astro (opcional, para auto-detectar idioma)
 * @returns Objeto con las traducciones cargadas
 */
export async function loadTranslations(
  locale?: string, 
  astroContext?: any
): Promise<Translations> {
  // Determinar el idioma actual
  const currentLocale = locale || astroContext?.currentLocale || 'es';
  
  try {
    // Intentar cargar las traducciones del idioma solicitado
    const translationModule = await import(`../../public/locales/${currentLocale}.json`);
    return translationModule.default || translationModule;
    
  } catch (error) {
    console.error(`Error loading translations for ${currentLocale}:`, error);
    
    // Fallback al idioma por defecto si no es el mismo
    if (currentLocale !== 'es') {
      try {
        console.log('Falling back to Spanish translations...');
        const fallbackModule = await import(`../../public/locales/es.json`);
        return fallbackModule.default || fallbackModule;
      } catch (fallbackError) {
        console.error('Error loading fallback translations:', fallbackError);
      }
    }
    
    // Si todo falla, retornar objeto vacío
    return {};
  }
}

/**
 * Hook para usar en componentes Astro de manera simple
 * @param astroProps - Las props del componente Astro
 * @param astroContext - El contexto de Astro
 * @returns Objeto con locale y traducciones
 */
export async function useTranslations(astroProps: any, astroContext: any) {
  const locale = astroProps?.locale || astroContext?.currentLocale || 'es';
  const translations = await loadTranslations(locale, astroContext);
  
  return {
    locale,
    translations,
    t: translations as any // Helper tipado
  };
}

/**
 * Función helper para obtener texto traducido con fallback
 * @param translations - Objeto de traducciones
 * @param key - Clave de la traducción (ej: 'about.title')
 * @param fallback - Texto por defecto si no existe la traducción
 * @returns Texto traducido o fallback
 */
export function getTranslation(
  translations: Translations, 
  key: string, 
  fallback: string = ''
): string {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return fallback;
    }
  }
  
  return typeof value === 'string' ? value : fallback;
}