interface Cookies {
  id?: string;
  password?: string;
}

export async function authenticate(): Promise<boolean> {
  // Retrieve cookies from the browser
  const cookies: Cookies = document.cookie
    .split(';')
    .reduce((acc: Cookies, cookie: string) => {
      const [key, value] = cookie.trim().split('=');
      return { ...acc, [key]: value };
    }, {});

  return (
    cookies.id === 'webskitters' && cookies.password === 'webskitters'
  );
}
