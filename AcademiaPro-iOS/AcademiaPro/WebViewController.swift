import UIKit
import WebKit
import UserNotifications

class WebViewController: UIViewController, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
    private var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.dataDetectorTypes = []
        
        // Enable localStorage persistence
        config.websiteDataStore = WKWebsiteDataStore.default()
        
        // Inject safe area CSS
        let safeAreaScript = WKUserScript(
            source: """
            document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)');
            document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
            document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)');
            document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)');
            document.body.style.paddingTop = 'env(safe-area-inset-top)';
            document.body.style.paddingBottom = 'env(safe-area-inset-bottom)';
            """,
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: true
        )
        config.userContentController.addUserScript(safeAreaScript)
        
        // Inject JS bridge
        let bridgeScript = WKUserScript(
            source: """
            window.AcademiaProNative = {
              isNative: true,
              scheduleNotification: function(id, title, body, timestamp, category) {
                window.webkit.messageHandlers.scheduleNotification.postMessage({
                  id: id, title: title, body: body, timestamp: timestamp, category: category
                });
              },
              cancelNotification: function(id) {
                window.webkit.messageHandlers.cancelNotification.postMessage({ id: id });
              },
              cancelAllNotifications: function() {
                window.webkit.messageHandlers.cancelAllNotifications.postMessage({});
              },
              haptic: function(type) {
                window.webkit.messageHandlers.requestHaptic.postMessage({ type: type });
              }
            };
            """,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: false
        )
        config.userContentController.addUserScript(bridgeScript)
        
        config.userContentController.add(self, name: "scheduleNotification")
        config.userContentController.add(self, name: "cancelNotification")
        config.userContentController.add(self, name: "cancelAllNotifications")
        config.userContentController.add(self, name: "requestHaptic")
        
        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.translatesAutoresizingMaskIntoConstraints = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 0.973, green: 0.980, blue: 0.988, alpha: 1.0) // #f8fafc
        webView.scrollView.bounces = false
        
        // Respect safe areas but fill screen
        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])
        
        loadLocalHTML()
        
        // Set initial theme
        let isDark = traitCollection.userInterfaceStyle == .dark
        webView.evaluateJavaScript("document.documentElement.setAttribute('data-theme', '\\(isDark ? "dark" : "light")')")
    }
    
    override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)
        let isDark = traitCollection.userInterfaceStyle == .dark
        webView.evaluateJavaScript("document.documentElement.setAttribute('data-theme', '\\(isDark ? "dark" : "light")')")
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .darkContent
    }
    
    override var prefersStatusBarHidden: Bool {
        return false
    }
    
    private func loadLocalHTML() {
        if let htmlPath = Bundle.main.path(forResource: "index", ofType: "html") {
            let htmlURL = URL(fileURLWithPath: htmlPath)
            webView.loadFileURL(htmlURL, allowingReadAccessTo: htmlURL.deletingLastPathComponent())
        }
    }
    
    // Handle target="_blank" links
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if navigationAction.targetFrame == nil {
            webView.load(navigationAction.request)
        }
        return nil
    }
    
    // Handle JavaScript alerts
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler() })
        present(alert, animated: true)
    }
    
    // Handle JavaScript confirms
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completionHandler(false) })
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(true) })
        present(alert, animated: true)
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "scheduleNotification" {
            guard let dict = message.body as? [String: Any],
                  let id = dict["id"] as? String,
                  let title = dict["title"] as? String,
                  let body = dict["body"] as? String,
                  let timestamp = dict["timestamp"] as? TimeInterval else { return }
            
            let category = dict["category"] as? String ?? ""
            let timeInterval = timestamp - Date().timeIntervalSince1970
            
            if timeInterval > 0 {
                let content = UNMutableNotificationContent()
                content.title = title
                content.body = body
                content.categoryIdentifier = category
                content.sound = .default
                content.badge = 1
                
                let trigger = UNTimeIntervalNotificationTrigger(timeInterval: timeInterval, repeats: false)
                let request = UNNotificationRequest(identifier: id, content: content, trigger: trigger)
                
                UNUserNotificationCenter.current().add(request)
            }
        } else if message.name == "cancelNotification" {
            guard let dict = message.body as? [String: Any],
                  let id = dict["id"] as? String else { return }
            UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [id])
        } else if message.name == "cancelAllNotifications" {
            UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
        } else if message.name == "requestHaptic" {
            guard let dict = message.body as? [String: Any],
                  let type = dict["type"] as? String else { return }
            
            switch type {
            case "light":
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
            case "medium":
                UIImpactFeedbackGenerator(style: .medium).impactOccurred()
            case "heavy":
                UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
            case "success":
                UINotificationFeedbackGenerator().notificationOccurred(.success)
            case "warning":
                UINotificationFeedbackGenerator().notificationOccurred(.warning)
            case "error":
                UINotificationFeedbackGenerator().notificationOccurred(.error)
            case "selection":
                UISelectionFeedbackGenerator().selectionChanged()
            default:
                break
            }
        }
    }
}
