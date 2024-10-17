import java.io.InputStream;
import integration.ecpayOperator.EcpayFunction;
import integration.errorMsg.ErrorMessage;
import integration.exception.EcpayException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class AllInOneBase {
	protected static String operatingMode;
	protected static String mercProfile;
	protected static String isProjectContractor;
	protected static String HashKey;
	protected static String HashIV;
	protected static String MerchantID;
	protected static String PlatformID;
	protected static String aioCheckOutUrl;
	protected static String doActionUrl;
	protected static String queryCreditTradeUrl;
	protected static String queryTradeInfoUrl;
	protected static String queryTradeUrl;
	protected static String tradeNoAioUrl;
	protected static String fundingReconDetailUrl;
	protected static String createServerOrderUrl;
	protected static Document verifyDoc;
	protected static String[] ignorePayment;

	public AllInOneBase() {
		try {
			Document doc;

			// 使用類路徑的方式讀取 XML 文件，以便在 JAR 和 Docker 中都能正確運行
			try (InputStream paymentConfStream = getClass().getResourceAsStream("/payment_conf.xml")) {
				if (paymentConfStream == null) {
					throw new EcpayException("payment_conf.xml not found in the classpath");
				}

				// 使用 EcpayFunction 來解析 InputStream
				doc = EcpayFunction.xmlParser(paymentConfStream);
			}

			// 設置文件結構並初始化配置
			doc.getDocumentElement().normalize();
			Element ele = (Element) doc.getElementsByTagName("OperatingMode").item(0);
			operatingMode = ele.getTextContent();

			ele = (Element) doc.getElementsByTagName("MercProfile").item(0);
			mercProfile = ele.getTextContent();

			ele = (Element) doc.getElementsByTagName("IsProjectContractor").item(0);
			isProjectContractor = ele.getTextContent();

			NodeList nodeList = doc.getElementsByTagName("MInfo");
			for (int i = 0; i < nodeList.getLength(); i++) {
				ele = (Element) nodeList.item(i);
				if (ele.getAttribute("name").equalsIgnoreCase(mercProfile)) {
					MerchantID = ele.getElementsByTagName("MerchantID").item(0).getTextContent();
					HashKey = ele.getElementsByTagName("HashKey").item(0).getTextContent();
					HashIV = ele.getElementsByTagName("HashIV").item(0).getTextContent();
					PlatformID = isProjectContractor.equalsIgnoreCase("N") ? "" : MerchantID;
				}
			}

			ele = (Element) doc.getElementsByTagName("IgnorePayment").item(0);
			nodeList = ele.getElementsByTagName("Method");
			ignorePayment = new String[nodeList.getLength()];
			for (int i = 0; i < nodeList.getLength(); i++) {
				ignorePayment[i] = nodeList.item(i).getTextContent();
			}

			if (HashKey == null) {
				throw new EcpayException(ErrorMessage.MInfo_NOT_SETTING);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new EcpayException("Failed to load configuration: " + e.getMessage());
		}
	}
}
