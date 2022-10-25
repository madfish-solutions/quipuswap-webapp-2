import { ClassNameProps } from '@shared/types';

interface MessageProps extends ClassNameProps {
  message: string;
}

interface ChildrenProps extends ClassNameProps {
  children: React.ReactNode;
}

export type AlarmMessageProps = MessageProps | ChildrenProps;

export const isPropsWithMessage = (props: AlarmMessageProps): props is MessageProps => {
  return 'message' in props;
};
