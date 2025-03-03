import { Col, Layout, Row, Space, Typography, Divider } from "antd";
import { GithubOutlined, GlobalOutlined, HeartOutlined } from "@ant-design/icons";
import styles from "./Footer.module.css";

function Footer() {
  const { Footer: AntFooter } = Layout;
  const { Text, Link: AntLink } = Typography;
  const year = new Date().getFullYear();

  return (
    <AntFooter className={styles.footer}>
      <Divider style={{ margin: "0 0 24px 0" }} />
      <Row gutter={[24, 16]} align="middle" justify="space-between">
        <Col xs={24} md={12} className={styles.copyrightCol}>
          <Space align="center">
            <HeartOutlined className={styles.heartIcon} />
            <Text className={styles.copyrightText}>
              Réalisé par{" "}
              <AntLink
                href="https://digit-tech-innov.com/"
                target="_blank"
                rel="noreferrer"
                strong
                className={styles.companyLink}
              >
                DIGIT-TECH-INNOV SARL
              </AntLink>{" "}
              © {year}
            </Text>
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Space size="large" className={styles.footerMenu} align="center" split={<Divider type="vertical" />}>
            <AntLink href="/doc" target="_blank" className={styles.footerLink}>
              <Space>
                <GlobalOutlined />
                Documentation
              </Space>
            </AntLink>
            <AntLink href="/" target="_blank" className={styles.footerLink}>
              <Space>
                <GithubOutlined />
                License
              </Space>
            </AntLink>
          </Space>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;