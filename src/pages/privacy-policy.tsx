import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { BaseLayout } from '@layouts/BaseLayout';
import { Card, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';

import s from '@styles/PrivacyPolicy.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation(['common', 'privacy']);

  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <BaseLayout
      title={t('privacy|Privacy Policy')}
      description={t('privacy|Privacy Policy page description. Couple sentences...')}
      className={cx(s.wrapper, modeClass[colorThemeMode])}
    >
      <Card>
        <CardContent className={s.content}>
          <h1 className={s.mb24}>{t('privacy|Privacy Policy')}</h1>
          <p className={s.big}>
            {t('privacy|This privacy policy (“Policy”) describes how')}
            {' '}
            <span className={s.list}>
              Madfish Solutions
            </span>
            {' '}
            {t('privacy|“Company”, “we”, “our”, or “us”) collects, uses, shares, and stores personal information of users of its website:')}
            {' '}
            <Button theme="inverse" href="https://quipuswap.com/" external>
              https://quipuswap.com/
            </Button>
            {' '}
            {t('privacy|(the “Interface”). This Policy applies to the Interface, applications, products, and services (collectively, “Services”) on or in which it is posted, linked, or referenced.')}
          </p>
          <br />
          <p className={s.big}>
            {t('privacy|By using the Services, you accept the terms of this')}
            {' '}
            <span className={s.list}>
              Privacy Policy
            </span>
            {' '}
            {t('privacy|and our')}
            {' '}
            <span className={s.list}>
              Terms of Service
            </span>
            {', '}
            {t('and consent to our collection, use, disclosure, and retention of your information as described in this Policy.  If you have not done so already, please also review our')}
            {' '}
            <span className={s.list}>
              Terms of Service
            </span>
            .
          </p>
          <br />
          <p className={s.big}>
            {t('privacy|IF YOU ARE UNWILLING TO AGREE TO THIS PRIVACY POLICY, OR YOU DO NOT HAVE THE RIGHT, POWER, AND AUTHORITY TO ACT ON BEHALF OF AND BIND THE BUSINESS, ORGANIZATION, OR OTHER ENTITY YOU REPRESENT, DO NOT ACCESS OR OTHERWISE USE THE INTERFACE.')}
          </p>
          <br />
          <p className={s.big}>
            {t('privacy|“Company”, “we”, “our”, or “us”) collects, uses, shares, and stores personal information of users of its website:')}
            {' '}
            <span className={s.list}>
              Madfish Solutions
            </span>
            {' '}
            {t('privacy|decides “why” and “how” your Personal Data is processed in connection with the Interface. If you have additional questions or require more information about this Privacy Policy, do not hesitate to contact')}
            <Button theme="inverse" href="info@madfish.solutions" external>
              info@madfish.solutions
            </Button>
            .
          </p>
          <br />
          <p className={s.big}>
            {t('privacy|This Privacy Policy applies only to the Interface activities and is valid for participants which are users of the Interface with regards to the Personal Data that they shared and/or collect within Quipuswap Interface. This Privacy Policy is not applicable to any Personal Data collected offline or via channels other than the Interface. Please read this Privacy Policy carefully to understand our policies and practices regarding your data and how it will be treated by the Interface.')}
          </p>
          <h4 className={s.mt40}>{t('privacy|1. Modification of this Policy')}</h4>
          <br />
          <p className={s.big}>
            <span className={s.list}>1.1.</span>
            {' '}
            {t('privacy|We reserve the right, in our sole discretion, to modify this Policy from time to time. If we make any modifications, we will notify you by updating the date at the top of the Agreement and by maintaining a current version of the Policy at')}
            {' '}
            <Button theme="inverse" href="https://quipuswap.com/privacy-policy" external>
              https://quipuswap.com/privacy-policy
            </Button>
          </p>
          <p className={cx(s.big, s.mt40)}>
            <span className={s.list}>1.2.</span>
            {' '}
            {t('privacy|All modifications will be effective when they are posted, and your continued use of the Interface will serve as confirmation of your acceptance of those modifications. If you do not agree with any modifications to this Policy, you must immediately stop accessing and using the Interface.')}
          </p>
          <h4 className={s.mt40}>{t('privacy|2. Eligibility')}</h4>
          <br />
          <p className={s.big}>
            {t('privacy|In order to use the Interface, you must satisfy the following requirements:')}
            <br />
            <br />
            <ol className={s.ol}>
              <li>
                {t('privacy|You represent that you are at least eighteen years old;')}
              </li>
              <li>
                {t('privacy|You have the full right, power, and authority to enter into and comply with the terms and conditions of this Agreement on behalf of yourself and any company or legal entity for which you may access or use the Interface;')}
              </li>
              <li>
                {t('privacy|You further represent that you are not a citizen, resident, or member of any jurisdiction or group where your use of the Interface would be illegal or otherwise violate any applicable law;')}
              </li>
              <li>
                {t('privacy|You further represent that your access and use of the Interface will fully comply with all applicable laws and regulations and that you will not access or use the Interface to conduct, promote, or otherwise facilitate any illegal activity.')}
              </li>
            </ol>
          </p>
          <h4 className={s.mt40}>{t('privacy|3. What we collect')}</h4>
          <br />
          <p className={s.big}>
            <span className={s.list}>3.1.</span>
            {' '}
            {t('privacy|To the maximum extent possible, we try to collect as minimum as possible Personal Information from you. Personal Information we collect:')}
            <br />
            <br />
            <ol className={s.ol}>
              <li>
                {t('privacy|Email address, your name, and any other Personal Information you provide to Us when communicating with us. Such Personal Information is used only for communication with you;')}
              </li>
              <li>
                {t('privacy|Data related to usage, performance, site security, traffic patterns, location information, browser, and device information only when you are using our services at our Interface.')}
              </li>
              <li>
                {t('privacy|Usage information, such as information about how you use the Service and interact with us;')}
              </li>
              <li>
                {t('privacy|Data collected by')}
                {' '}
                <Button theme="inverse" href="https://support.google.com/analytics/answer/6366371?hl=en#zippy=%2Cin-this-article" external>
                  Google Analytics
                </Button>
                {' '}
                {t('privacy|and')}
                {' '}
                <Button theme="inverse" href="https://www.facebook.com/business/m/privacy-and-data" external>
                  Facebook Ads Pixel
                </Button>
              </li>
            </ol>
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>3.2.</span>
            {' '}
            {t('privacy|Information we will never collect: We will never ask you to share your private keys or wallet seed. Never trust anyone or any site that asks you to enter your private keys or wallet seed.')}
          </p>
          <h4 className={s.mt40}>{t('privacy|4. Ways of collecting')}</h4>
          <br />
          <p className={s.big}>
            <span className={s.list}>4.1.</span>
            {' '}
            {t('privacy|Information is collected automatically. We may automatically record certain information about how you use our Interface (we refer to this information as “Log Data“) by using Google Analytics or Product analytical tools. Log Data may include:')}
            <br />
            <br />
            <ol className={s.ol}>
              <li>
                {t('privacy|the information such as a user’s, device, and browser type, operating system;')}
              </li>
              <li>
                {t('privacy|the pages or features of our Interface to which a user browsed and the time spent on those pages or features;')}
              </li>
              <li>
                {t('privacy|the frequency with which the Interface is used by a user;')}
              </li>
              <li>
                {t('privacy|the links on our Interface that a user clicked on or used, and other statistics.')}
              </li>
            </ol>
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>4.2.</span>
            {' '}
            {t('privacy|We use this information to administer the Service and we analyze (and may engage third parties to analyze) this information to improve and enhance the Service by expanding its features and functionality and tailoring it to our users’ needs and preferences.')}
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>4.3.</span>
            {' '}
            {t('privacy|We may use cookies, local storage, or similar technologies to analyze trends, administer the Interface, track users’ movements around the Interface, and gather demographic information about our user base as a whole. Users can control the use of cookies and local storage at the individual browser level.')}
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>4.4.</span>
            {' '}
            {t('privacy|We also may use Google Analytics (and similar services) to help us offer you an optimized user experience.')}
          </p>
          <h4 className={s.mt40}>{t('privacy|5. Use of personal information')}</h4>
          <br />
          <p className={s.big}>
            <span className={s.list}>5.1.</span>
            {' '}
            {t('privacy|To provide our service. We will use your personal information in the following ways:')}
            <br />
            <br />
            <ol className={s.ol}>
              <li>
                {t('privacy|To enable you to access and use the Services;')}
              </li>
              <li>
                {t('privacy|To provide and deliver products and services that you may request;')}
              </li>
            </ol>
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>5.2.</span>
            {' '}
            {t('privacy|To communicate with you. We use your personal information to communicate about promotions, upcoming events, and other news about products and services offered by us and our selected partners.')}
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>5.3.</span>
            {' '}
            {t('privacy|To optimize our platform. In order to optimize your user experience, we may use your personal information to operate, maintain, and improve our Services. We may also use your information to respond to your comments and questions regarding the Services and to provide you and other users with general customer service.')}
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>5.4.</span>
            {' '}
            {t('privacy|For compliance, fraud prevention, and safety. We may use your personal information to protect, investigate, and deter fraudulent, unauthorized, or illegal activity.')}
          </p>
          <h4 className={s.mt40}>{t('privacy|6. Sharing of personal data')}</h4>
          <br />
          <p className={s.big}>
            {t('privacy|We do not share the personal information that you provide us with other organizations without your express consent, except as described in this Privacy Policy.')}
          </p>
          <h4 className={s.mt40}>{t('privacy|7. Protection of personal data')}</h4>
          <br />
          <p className={s.big}>
            <span className={s.list}>7.1.</span>
            {' '}
            {t('privacy|We retain the information we collect as long as it is necessary and relevant to fulfill the purposes outlined in this privacy policy. In addition, we retain personal information to prevent fraud, resolve disputes, troubleshoot problems, assist with any investigation, enforce our Terms of Service, and other actions permitted by law.')}
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>7.2.</span>
            {' '}
            {t('privacy|To determine the appropriate retention period for personal information, we consider the amount, nature, and sensitivity of the personal information, the potential risk of harm from unauthorized use or disclosure of your personal information, the purposes for which we process your personal information, and whether we can achieve those purposes through other means, and the applicable legal requirements.')}
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>7.3.</span>
            {' '}
            {t('privacy|We employ standard security measures designed to protect the security of all information submitted through the Services. However, the security of information transmitted through the internet can never be guaranteed.  We are not responsible for any interception or interruption of any communications through the internet or for changes to or losses of data.')}
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>7.4.</span>
            {' '}
            {t('privacy|Users of the Services are responsible for maintaining the security of any password, biometrics, user ID, or other forms of authentication involved in obtaining access to password-protected or secure areas of any of our digital services.')}
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>7.5.</span>
            {' '}
            {t('privacy|In order to protect you and your data, we may suspend your use of any of the Services, without notice, pending an investigation, if any breach of security is suspected.')}
          </p>
          <h4 className={s.mt40}>{t('privacy|8. Your Rights')}</h4>
          <br />
          <p className={s.big}>
            {t('privacy|You have certain rights regarding your personal information. You may ask us to take the following actions in relation to the personal information that we hold:')}
            <br />
            <br />
            <ol className={s.ol}>
              <li>
                {t('privacy|Opt-out. Stop sending you direct marketing communications which you have previously consented to receive. We may continue to send you Service-related and other non-marketing communications.')}
              </li>
              <li>
                {t('privacy|Correct. Update or correct inaccuracies in your personal information.')}
              </li>
              <li>
                {t('privacy|Delete. Delete your personal information.')}
              </li>
              <li>
                {t('privacy|Transfer. Transfer a machine-readable copy of your personal information to you or a third party of your choice.')}
              </li>
              <li>
                {t('privacy|Restrict. Restrict the processing of your personal information.')}
              </li>
            </ol>
          </p>
          <h4 className={s.mt40}>{t('privacy|9. Cookies')}</h4>
          <br />
          <p className={s.big}>
            {t('privacy|You can set your browser to refuse all or some browser cookies or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of the Interface may become inaccessible or not function properly.')}
          </p>
          <h4 className={s.mt40}>{t('privacy|Contact us')}</h4>
          <br />
          <p className={s.big}>
            {t('privacy|We welcome your comments or questions about this Policy, and you may contact us at')}
            {' '}
            <Button theme="inverse" href="info@madfish.solutions" external>
              info@madfish.solutions
            </Button>
          </p>
        </CardContent>
      </Card>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'privacy']),
  },
});

export default PrivacyPolicy;
