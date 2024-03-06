import {
  FacebookFilled,
  InstagramFilled,
  MailFilled,
  TwitterCircleFilled,
} from '@ant-design/icons';
import { Col, Row, Space } from 'antd';
import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ENDPOINT_FOOTER_GROUPS, ENDPOINT_FOOTER_LINKS } from '../../configs/constants';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addFooterGroups, addFooterLinks } from '../../pages/reducer/pages';
import { FooterGroup, FooterLink } from '@nero/query-api-service';
import { apiService } from '../../services/api';

const Footer = () => {
  const footerGroups = useAppSelector((state) => state.dynamicPages.footerGroups);
  const footerLinks = useAppSelector((state) => state.dynamicPages.footerLinks);
  const getUngroupedLinks = useCallback(
    () => footerLinks.filter((link) => !link.group),
    [footerLinks]
  );
  const getGroupsWithLinks = useCallback(
    () => footerGroups.filter((group) => group.links.length > 0),
    [footerGroups]
  );
  const ungroupedLinks = getUngroupedLinks();
  const dispatch = useAppDispatch();
  const { facebookProfile, twitterProfile, instagramProfile, contactEmail } = useAppSelector(
    (state) => state.config
  );
  const displaySocialLinks = useCallback(
    () => facebookProfile || twitterProfile || instagramProfile,
    [facebookProfile, twitterProfile, instagramProfile]
  );

  useEffect(() => {
    // fetch footer groups incase server side rendering fails
    if (!footerGroups.length) {
      apiService
        .getAxiosInstance()
        .get<FooterGroup[]>(ENDPOINT_FOOTER_GROUPS, {
          withCredentials: false,
          headers: { 'X-Ignore-Credentials': true },
        })
        .then((res) => {
          dispatch(addFooterGroups(res.data));
        })
        .catch(() => {
          dispatch(addFooterGroups([]));
        });
    }

    if (!footerLinks.length) {
      apiService
        .getAxiosInstance()
        .get<FooterLink[]>(ENDPOINT_FOOTER_LINKS, {
          withCredentials: false,
          headers: { 'X-Ignore-Credentials': true },
        })
        .then((res) => {
          dispatch(addFooterLinks(res.data));
        })
        .catch(() => {
          dispatch(addFooterLinks([]));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="nero-footer">
      <Row justify={getGroupsWithLinks().length > 0 ? 'space-around' : undefined}>
        {getGroupsWithLinks().map((group) => (
          <Col key={group.id} xs={24} sm={24} md={6} className="nero-footer__group">
            <span className="nero-footer__group-title">{group.title}</span>
            <ul>
              {group.links.map((link) => (
                <li key={link.id}>
                  <Link to={`/${link.link_to.slug}`}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </Col>
        ))}
        {contactEmail && (
          <Col xs={24} sm={24} md={6} className="nero-footer__group">
            <span className="nero-footer__group-title">Contact Us</span>
            <ul>
              <li>
                <Space>
                  <MailFilled className="nero-footer__list-item-icon" />
                  <span>{contactEmail}</span>
                </Space>
              </li>
            </ul>
          </Col>
        )}
        {displaySocialLinks() && (
          <Col xs={24} sm={24} md={6} className="nero-footer__group">
            <span className="nero-footer__group-title">Follow us</span>
            <div>
              {facebookProfile && (
                <a
                  href={facebookProfile}
                  target="_blank"
                  rel="noreferrer"
                  className="nero-footer__social-link"
                >
                  <FacebookFilled />
                </a>
              )}
              {twitterProfile && (
                <a
                  href={twitterProfile}
                  target="_blank"
                  rel="noreferrer"
                  className="nero-footer__social-link"
                >
                  <TwitterCircleFilled />
                </a>
              )}
              {instagramProfile && (
                <a
                  href={instagramProfile}
                  target="_blank"
                  rel="noreferrer"
                  className="nero-footer__social-link"
                >
                  <InstagramFilled />
                </a>
              )}
            </div>
          </Col>
        )}
      </Row>

      {(getGroupsWithLinks().length > 0 || displaySocialLinks() || contactEmail) &&
        ungroupedLinks.length > 0 && <div className="nero-footer__group-divider mtb-15"></div>}

      {ungroupedLinks.length > 0 && (
        <>
          {ungroupedLinks.map((link) => (
            <Link
              key={link.id}
              to={`/${link.link_to.slug}`}
              className="nero-footer__ungrouped-link"
            >
              {link.title}
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

export { Footer as default };
