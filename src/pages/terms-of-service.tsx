import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { BaseLayout } from '@layouts/BaseLayout';
import { Card, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';

import s from '@styles/Terms.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const TermsOfUse: React.FC = () => {
  const { t } = useTranslation(['terms', 'common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <BaseLayout
      title={t('terms|Terms of Usage')}
      description={t('terms|Terms of Usage page description. Couple sentences...')}
      className={cx(s.wrapper, modeClass[colorThemeMode])}
    >
      <Card>
        <CardContent className={s.content}>
          <h1 className={s.mb24}>{t('terms|Terms of Service')}</h1>
          <p className={s.big}>
            {t('terms|Welcome to')}
            {' '}
            <Button theme="inverse" href="https://quipuswap.com/" external>
              https://quipuswap.com/
            </Button>
            {', '}
            {t('terms|a website-hosted user interface (the “Interface”, “App”, "Service") provided by Madfish Solutions (“COMPANY”, “we”, “our\'\', or “us”). The Interface provides access to the seamless decentralized exchange of Tezos-based tokens and XTZ.')}
            <br />
            <br />
            {t('terms|This Terms of Service Agreement (the “Agreement”) explains the terms and conditions by which you may access and use the Interface. You must read this Agreement carefully.')}
          </p>
          <p className={s.smol}>
            <i>{t('By accessing or using the Interface, you signify that you have read, understand, and agree to be bound by this Agreement in its entirety. If you do not agree, you are not authorized to access or use the Interface.')}</i>
          </p>
          <p className={s.big}>
            {t('terms|By using or accessing the Interface, you represent and warrant that you understand that there are inherent risks associated with cryptocurrency, and the underlying technologies including, without limitation, cryptography and blockchain, and you agree that Madfish Solutions is not responsible for any losses or damages associated with these risks.')}
          </p>
          <p className={s.big}>
            {t('terms|You specifically acknowledge and agree that the Interface facilitates your interaction with decentralized networks and technology and, as such, we have no control over any blockchain or cryptocurrencies and cannot and do not ensure that any of your interactions will be confirmed on the relevant blockchain and do not have the ability to effectuate any cancellation or modification requests regarding any of your interactions.')}
          </p>
          <h4 className={s.mt40}>{t('terms|1. Modification of this Agreement')}</h4>
          <br />
          <p className={s.big}>
            <span className={s.list}>1.1.</span>
            {' '}
            {t('terms|We reserve the right, in our sole discretion, to modify this Agreement at any time. If we make any modifications, we will notify you by updating the date at the top of the Agreement and by maintaining a current version of the Agreement at')}
            {' '}
            <Button theme="inverse" href="https://quipuswap.com/terms-of-service" external>
              https://quipuswap.com/terms-of-service
            </Button>
            .
          </p>
          <p className={cx(s.big, s.mt40)}>
            <span className={s.list}>1.2.</span>
            {' '}
            {t('terms|All modifications will be effective when they are posted, and your continued use of the Interface will serve as confirmation of your acceptance of those modifications. If you do not agree with any modifications to this Agreement, you must immediately stop accessing and using the Interface.')}
          </p>
          <h4 className={s.mt40}>{t('terms|2. Eligibility')}</h4>
          <br />
          <p className={s.big}>
            {t('terms|In order to use the Interface, you must satisfy the following requirements:')}
            <br />
            <br />
            <ol className={s.ol}>
              <li>
                {t('terms|You represent that you are at least eighteen years old;')}
              </li>
              <li>
                {t('terms|You have the full right, power, and authority to enter into and comply with the terms and conditions of this Agreement on behalf of yourself and any company or legal entity for which you may access or use the Interface;')}
              </li>
              <li>
                {t('terms|You further represent that you are not a citizen, resident, or member of any jurisdiction or group where your use of the Interface would be illegal or otherwise violate any applicable law;')}
              </li>
              <li>
                {t('terms|You further represent that your access and use of the Interface will fully comply with all applicable laws and regulations and that you will not access or use the Interface to conduct, promote, or otherwise facilitate any illegal activity.')}
              </li>
            </ol>
          </p>
          <h4 className={s.mt40}>{t('terms|3. Proprietary Rights')}</h4>
          <br />
          <p className={s.big}>
            <span className={s.list}>3.1.</span>
            {' '}
            {t('terms|We own all intellectual property and other rights in the Interface and its contents, including (but not limited to) text, images, trademarks, service marks, copyrights, and designs. Unless expressly authorized by us, you may not copy, modify, adapt, rent, license, sell, publish, distribute, or otherwise permit any third party to access or use the Interface or any of its contents.')}
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>3.2.</span>
            {' '}
            {t('terms|Unlike the Interface, the AMM Protocol is composed entirely of open-source software running on the public Tezos blockchain and is distributed under the MIT license. Basically, you can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source.')}
          </p>
          <h4 className={s.mt40}>{t('terms|4. Prohibited Activity')}</h4>
          <br />
          <p className={s.big}>
            {t('terms|You agree not to engage in, or attempt to engage in, any of the following categories of prohibited acts in relation to your access and use of the Interface:')}
            <br />
            <br />
            <ol className={s.ol}>
              <li>
                {t('terms|Intellectual Property Infringement. Activity that infringes on or violates any copyright, trademark, service mark, right of publicity, right of privacy, or other proprietary or intellectual property rights under the law;')}
              </li>
              <li>
                {t('terms|Cyberattack. Activity that seeks to interfere with or compromise the integrity, security, or proper functioning of any computer, server, network, personal device, or other information technology system, including (but not limited to) the deployment of viruses and denial of service attacks;')}
              </li>
              <li>
                {t('terms|Fraud and Misrepresentation. Activity that seeks to defraud us or any other person or entity, including (but not limited to) providing any false, inaccurate, or misleading information in order to unlawfully obtain the property of another;')}
              </li>
              <li>
                {t('terms|Market Manipulation. Activity that violates any applicable law, rule, or regulation concerning the integrity of trading markets, including (but not limited to) the manipulative tactics commonly known as spoofing and wash trading;')}
              </li>
              <li>
                {t('terms|Any Other Unlawful Conduct. Activity that violates any applicable law, rule, or regulation of the relevant jurisdiction, including (but not limited to) the restrictions and regulatory requirements.')}
              </li>
            </ol>
          </p>
          <h4 className={s.mt40}>{t('terms|5. No Financial Advice')}</h4>
          <br />
          <p className={s.big}>
            {t('terms|All information provided by the Interface is for informational purposes only and should not be construed as professional advice. You should not take, or refrain from taking, any action based on any information contained in the Interface. Before you make any financial, legal, or other decisions involving the Interface, you should seek independent professional advice from an individual who is licensed and qualified in the area for which such advice would be appropriate.')}
          </p>
          <h4 className={s.mt40}>{t('terms|6. No Warranties')}</h4>
          <br />
          <p className={s.big}>
            <span className={s.list}>6.1.</span>
            {' '}
            {t('terms|The Interface is provided on an “AS IS” and “AS AVAILABLE” basis. To the fullest extent permitted by law, we disclaim any representations and warranties of any kind, whether express, implied, or statutory, including (but not limited to) the warranties of merchantability and fitness for a particular purpose. You acknowledge and agree that your use of the Interface is at your own risk.')}
          </p>
          <p className={cx(s.big, s.mt40)}>
            <span className={s.list}>6.2.</span>
            {' '}
            {t('terms|We do not represent or warrant that access to the Interface will be continuous, uninterrupted, timely, or secure; that the information contained in the Interface will be accurate, reliable, complete, or current; or that the Interface will be free from errors, defects, viruses, or other harmful elements. No advice, information, or statement that we make should be treated as creating any warranty concerning the Interface. We do not endorse, guarantee, or assume responsibility for any advertisements, offers, or statements made by third parties concerning the Interface.')}
          </p>
          <h4 className={s.mt40}>{t('terms|7. Assumption of Risk')}</h4>
          <br />
          <p className={s.big}>
            <span className={s.list}>7.1.</span>
            {' '}
            {t('terms|By accessing and using the Interface, you represent that you understand')}
          </p>
          <br />
          <ul className={s.ul}>
            <li>
              {t('terms|the inherent risks associated with products made available through the Protocol;')}
            </li>
            <li>
              {t('terms|the inherent risks associated with using cryptographic and blockchain-based systems.')}
            </li>
          </ul>
          <br />
          <p className={s.big}>
            <span className={s.list}>7.2.</span>
            {' '}
            {t('terms|You further represent that you have a working knowledge of the usage and intricacies of blockchain-based digital assets, including, without limitation, FA1.2 and FA2 token standards available on the Tezos blockchain. ')}
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>7.3.</span>
            {' '}
            {t('terms|You further understand that the markets for these blockchain-based digital assets are highly volatile due to factors that include, but are not limited to, adoption, speculation, technology, security, and regulation. ')}
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>7.4.</span>
            {' '}
            {t('terms|You acknowledge that the cost and speed of transacting with blockchain-based systems, such as Tezos, are variable and may increase or decrease, respectively, drastically at any time.')}
          </p>
          <br />
          <p className={s.big}>
            <span className={s.list}>7.5.</span>
            {' '}
            {t('terms|You hereby acknowledge and agree that we are not responsible for any of these variables or risks associated with the Protocol and cannot be held liable for any resulting losses that you experience while accessing or using the Interface. Accordingly, you understand and agree to assume full responsibility for all of the risks of accessing and using the Interface to interact with the Protocol.')}
          </p>
          <h4 className={s.mt40}>{t('terms|8. Third-Party Resources and Promotions')}</h4>
          <br />
          <p className={s.big}>
            <span className={s.list}>8.1.</span>
            {' '}
            {t('terms|The Interface may contain references or links to third-party resources, including, but not limited to, information, materials, products, or services, that we do not own or control. In addition, third parties may offer promotions related to your access and use of the Interface. ')}
          </p>
          <p className={cx(s.big, s.mt40)}>
            <span className={s.list}>8.2.</span>
            {' '}
            {t('terms|We do not endorse or assume any responsibility for any such resources or promotions. If you access any such resources or participate in any such promotions, you do so at your own risk, and you understand that the Terms do not apply to your dealings or relationships with any third parties. You expressly relieve us of any and all liability arising from your use of any such resources or participation in any such promotions.')}
          </p>
          <h4 className={s.mt40}>{t('terms|9. Limitation of Liability')}</h4>
          <br />
          <p className={s.big}>
            {t('terms|Under no circumstances shall we or any of our officers, directors, employees, contractors, agents, affiliates, or subsidiaries be liable to you for any indirect, punitive, incidental, special, consequential, or exemplary damages, including (but not limited to) damages for loss of profits, goodwill, use, data, or other intangible property, arising out of or relating to any access to or use of the Interface, not will we be responsible for any damage, loss, or injury resulting from hacking, tampering, or other unauthorized access to, or use of the Interface, or from any access to, or use of any information obtained by any unauthorized access to, or use of the Interface. We assume no liability or responsibility for any:')}
            <br />
            <br />
            <ol className={s.ol}>
              <li>
                {t('terms|errors, mistakes, or inaccuracies of content;')}
              </li>
              <li>
                {t('terms|personal injury or property damage, of any nature whatsoever, resulting from any access to or use of the Interface;')}
              </li>
              <li>
                {t('terms|unauthorized access to or use of any secure server or database in our control or the use of any information or data stored therein; ')}
              </li>
              <li>
                {t('terms|interruption or cessation of function related to the Interface; ')}
              </li>
              <li>
                {t('terms|bugs, viruses, trojan horses, or the like that may be transmitted to or through the Interface; ')}
              </li>
              <li>
                {t('terms|errors or omissions in, or loss or damage incurred as a result of, the use of any content made available through the Interface;')}
              </li>
              <li>
                {t('terms|the defamatory, offensive, or illegal conduct of any third party.')}
              </li>
            </ol>
          </p>
          <h4 className={s.mt40}>{t('terms|10. Release of Claims')}</h4>
          <br />
          <p className={s.big}>
            {t('terms|You expressly agree that you assume all risks in connection with your access and use of the Interface. You further expressly waive and release us from any and all liability, claims, causes of action, or damages arising from or in any way relating to your access and use of the Interface.')}
          </p>
          <h4 className={s.mt40}>{t('terms|11. Limitation of Liability')}</h4>
          <br />
          <p className={s.big}>
            {t('terms|You agree to hold harmless, release, defend, and indemnify us and our officers, directors, employees, contractors, agents, affiliates, and subsidiaries from and against all claims, damages, obligations, losses, liabilities, costs, and expenses arising from:')}
            <br />
            <br />
            <ol className={s.ol}>
              <li>
                {t('terms|your access and use of the Interface; ')}
              </li>
              <li>
                {t('terms|your violation of the Terms, the rights of any third party, or any other applicable law, rule, or regulation; ')}
              </li>
              <li>
                {t('any other party’s access and use of the Interface with your assistance or using any device or account that you own or control.')}
              </li>
            </ol>
          </p>
          <h4 className={s.mt40}>{t('terms|12. Class Action and Jury Trial Waiver')}</h4>
          <br />
          <p className={s.big}>
            {t('terms|You must bring any and all Disputes against us in your individual capacity and not as a plaintiff in or member of any purported class action, collective action, private attorney general action, or other representative proceedings. This provision applies to class arbitration. You and we both agree to waive the right to demand a trial by jury.')}
          </p>
          <h4 className={s.mt40}>{t('terms|13. Dispute Resolution')}</h4>
          <br />
          <p className={s.big}>
            {t('terms|We will use our best efforts to resolve any potential disputes through informal, good-faith negotiations. If a potential dispute arises, you must contact us by sending an email to')}
            {' '}
            <Button theme="inverse" href="info@madfish.solutions" external>
              info@madfish.solutions
            </Button>
            {' '}
            {t('terms|so that we can attempt to resolve it without resorting to formal dispute resolution. If we aren’t able to reach an informal resolution within sixty days of your email, then you and we both agree to resolve the potential dispute according to the process set forth below.')}
          </p>
          <h4 className={s.mt40}>{t('terms|14. Governing Law')}</h4>
          <br />
          <p className={s.big}>
            {t('terms|You agree that the laws of Ukraine, without regard to principles of conflict of laws, govern the Terms and any dispute between you and us.')}
          </p>
          <h4 className={s.mt40}>{t('terms|15. Entire Agreement')}</h4>
          <br />
          <p className={s.big}>
            {t('terms|The Terms, including the Privacy Policy, constitute the entire agreement between you and us with respect to the subject matter hereof, including the Interface. The Terms, including the Privacy Policy, supersede any and all prior or contemporaneous written and oral agreements, communications, and other understandings relating to the subject matter of the Terms.')}
          </p>
          <h4 className={s.mt40}>{t('terms|Contact us')}</h4>
          <br />
          <p className={s.big}>
            {t('terms|If you have any questions, claims, complaints, or suggestions, please, contact us at')}
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
    ...await serverSideTranslations(locale, ['common', 'terms']),
  },
});

export default TermsOfUse;
