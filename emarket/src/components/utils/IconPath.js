const iconPath = (iconName) => {
  const folder = 'iconimg'  
  const publicUrl = `${window.location.origin}${window.location.pathname}`;
  console.log(publicUrl)
  return `${process.env.PUBLIC_URL}/${folder}/${iconName}` || `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${folder}/${iconName}`;
};
export default iconPath;