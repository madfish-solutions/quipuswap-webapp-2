import md5 from 'md5';

export const hash = (data: string) => md5(data);
