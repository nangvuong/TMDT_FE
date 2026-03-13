/**
 * Utility function to merge classnames conditionally
 * Useful for combining Tailwind CSS classes
 * @param classes - Array of classname strings or conditional objects
 * @returns Merged classname string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter((className): className is string => {
      return typeof className === 'string' && className.length > 0;
    })
    .join(' ');
}

export default cn;
