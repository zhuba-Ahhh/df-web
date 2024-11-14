declare interface Window {
  Babel: any;
  define: any;
}
declare module '*.less' {
  const className: { [key: string]: string };
  export default className;
}
