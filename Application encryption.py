import sys
import os
import random
import string
import base64
import zlib
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
    QPushButton, QLabel, QLineEdit, QFileDialog, QMessageBox, 
    QCheckBox
)
from PyQt6.QtCore import Qt, QThread, pyqtSignal
from PyQt6.QtGui import QFont
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


def obfuscate_python_code(source_code: str) -> str:
    """
    درهم‌ریختن و نامفهوم‌سازی کدهای پایتون در چندین لایه
    """
    # لایه ۱: فشرده‌سازی با zlib و تبدیل به base64
    compressed = zlib.compress(source_code.encode('utf-8'))
    b64_encoded = base64.b64encode(compressed).decode('utf-8')

    # ایجاد نام متغیرهای عمیقاً نامفهوم (ترکیب l و 1 یا O و 0)
    var1 = ''.join(random.choices(['l', '1', 'I'], k=16))
    var2 = ''.join(random.choices(['O', '0', 'Q'], k=16))
    var3 = ''.join(random.choices(['S', '5', 'z'], k=16))

    # لایه ۲: ساخت پوسته اجرایی هوشمند
    obfuscated_wrapper = f"""# Obfuscated by CyberVault Tool
import base64 as {var1}, zlib as {var2}
{var3} = {var1}.b64decode('{b64_encoded}')
exec({var2}.decompress({var3}).decode('utf-8'))
"""
    return obfuscated_wrapper


class CryptoWorker(QThread):
    finished = pyqtSignal(bool, str)

    def __init__(self, mode, file_path, password, do_obfuscate=False):
        super().__init__()
        self.mode = mode
        self.file_path = file_path
        self.password = password
        self.do_obfuscate = do_obfuscate

    def _derive_key(self, password: str, salt: bytes) -> bytes:
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        return base64.urlsafe_b64encode(kdf.derive(password.encode()))

    def run(self):
        try:
            if not os.path.exists(self.file_path):
                self.finished.emit(False, "فایل انتخابی یافت نشد.")
                return

            if self.mode == "encrypt":
                with open(self.file_path, "rb") as f:
                    data = f.read()

                # اگر فایل پایتون باشد و تیک Obfuscate خورده باشد
                if self.do_obfuscate:
                    if self.file_path.endswith('.py'):
                        try:
                            source_text = data.decode('utf-8')
                            obfuscated_text = obfuscate_python_code(source_text)
                            data = obfuscated_text.encode('utf-8')
                        except Exception as e:
                            self.finished.emit(False, f"خطا در درهم‌ریختن کد پایتون: {str(e)}")
                            return

                salt = os.urandom(16)
                key = self._derive_key(self.password, salt)
                fernet = Fernet(key)

                encrypted_data = fernet.encrypt(data)
                
                output_path = self.file_path + ".enc"
                with open(output_path, "wb") as f:
                    f.write(salt + encrypted_data)

                msg = f"فایل با موفقیت رمزنگاری شد:\n{output_path}"
                if self.do_obfuscate and self.file_path.endswith('.py'):
                    msg = "کد پایتون با موفقیت Obfuscate و سپس رمزنگاری شد:\n" + output_path

                self.finished.emit(True, msg)

            elif self.mode == "decrypt":
                with open(self.file_path, "rb") as f:
                    file_content = f.read()

                if len(file_content) < 16:
                    self.finished.emit(False, "فایل معتبر نیست یا آسیب دیده است.")
                    return

                salt = file_content[:16]
                encrypted_data = file_content[16:]

                key = self._derive_key(self.password, salt)
                fernet = Fernet(key)

                try:
                    decrypted_data = fernet.decrypt(encrypted_data)
                except Exception:
                    self.finished.emit(False, "رمز عبور اشتباه است یا فایل دستکاری شده است.")
                    return

                if self.file_path.endswith(".enc"):
                    output_path = self.file_path[:-4]
                else:
                    output_path = self.file_path + ".dec"

                with open(output_path, "wb") as f:
                    f.write(decrypted_data)

                self.finished.emit(True, f"فایل با موفقیت رمزگشایی شد:\n{output_path}")

        except Exception as e:
            self.finished.emit(False, f"خطایی رخ داد: {str(e)}")


class DarkCryptoApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("تاسیسات رمزنگاری و Obfuscator فایل - CyberVault")
        self.setFixedSize(560, 460)
        self.setLayoutDirection(Qt.LayoutDirection.RightToLeft)

        # استایل‌دهی مدرن و تیره (Dark Mode)
        self.setStyleSheet("""
            QMainWindow {
                background-color: #0f172a;
            }
            QLabel {
                color: #f8fafc;
                font-size: 13px;
            }
            QLineEdit {
                background-color: #1e293b;
                border: 1px solid #334155;
                border-radius: 8px;
                color: #f8fafc;
                padding: 10px;
                font-size: 13px;
            }
            QLineEdit:focus {
                border: 1px solid #38bdf8;
            }
            QCheckBox {
                color: #cbd5e1;
                font-size: 12px;
                spacing: 8px;
            }
            QCheckBox::indicator {
                width: 18px;
                height: 18px;
                border-radius: 4px;
                border: 1px solid #475569;
                background-color: #1e293b;
            }
            QCheckBox::indicator:checked {
                background-color: #0284c7;
                border-color: #38bdf8;
            }
            QPushButton {
                background-color: #1e293b;
                color: #f8fafc;
                border: 1px solid #334155;
                border-radius: 8px;
                padding: 10px 16px;
                font-weight: bold;
                font-size: 13px;
            }
            QPushButton:hover {
                background-color: #334155;
                border-color: #475569;
            }
            QPushButton#primaryBtn {
                background-color: #0284c7;
                border: none;
            }
            QPushButton#primaryBtn:hover {
                background-color: #0369a1;
            }
            QPushButton#dangerBtn {
                background-color: #e11d48;
                border: none;
            }
            QPushButton#dangerBtn:hover {
                background-color: #be123c;
            }
        """)

        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(24, 24, 24, 24)
        main_layout.setSpacing(16)

        # عنوان برنامه
        title_label = QLabel("قفل‌گذار و درهم‌ریز پیشرفته فایل")
        title_font = QFont()
        title_font.setPointSize(16)
        title_font.setBold(True)
        title_label.setFont(title_font)
        title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        main_layout.addWidget(title_label)

        desc_label = QLabel("فایل یا سورس کد خود را انتخاب کرده و با کلید رمزنگاری امن محافظت کنید.")
        desc_label.setStyleSheet("color: #94a3b8; font-size: 12px;")
        desc_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        main_layout.addWidget(desc_label)

        # بخش انتخاب فایل
        file_layout = QHBoxLayout()
        self.file_path_input = QLineEdit()
        self.file_path_input.setPlaceholderText("مسیر فایل را انتخاب کنید...")
        self.file_path_input.setReadOnly(True)
        
        browse_btn = QPushButton("انتخاب فایل")
        browse_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        browse_btn.clicked.connect(self.browse_file)

        file_layout.addWidget(self.file_path_input)
        file_layout.addWidget(browse_btn)
        main_layout.addLayout(file_layout)

        # بخش کلید / رمز عبور
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("رمز عبور اختصاصی را وارد کنید...")
        self.password_input.setEchoMode(QLineEdit.EchoMode.Password)
        main_layout.addWidget(self.password_input)

        # گزینه Obfuscation برای کدهای پایتون
        self.obfuscate_checkbox = QCheckBox("اعمال Obfuscation (درهم‌ریختن ساختار کدهای پایتون قبل از رمزنگاری)")
        self.obfuscate_checkbox.setCursor(Qt.CursorShape.PointingHandCursor)
        main_layout.addWidget(self.obfuscate_checkbox)

        # دکمه‌های عملیات
        btn_layout = QHBoxLayout()
        
        self.encrypt_btn = QPushButton("رمزنگاری فایل")
        self.encrypt_btn.setObjectName("primaryBtn")
        self.encrypt_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self.encrypt_btn.clicked.connect(lambda: self.process_file("encrypt"))

        self.decrypt_btn = QPushButton("رمزگشایی فایل")
        self.decrypt_btn.setObjectName("dangerBtn")
        self.decrypt_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self.decrypt_btn.clicked.connect(lambda: self.process_file("decrypt"))

        btn_layout.addWidget(self.encrypt_btn)
        btn_layout.addWidget(self.decrypt_btn)
        main_layout.addLayout(btn_layout)

        # وضعیت
        self.status_label = QLabel("")
        self.status_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.status_label.setStyleSheet("color: #38bdf8; font-weight: bold;")
        main_layout.addWidget(self.status_label)

    def browse_file(self):
        file_name, _ = QFileDialog.getOpenFileName(self, "انتخاب فایل", "", "All Files (*)")
        if file_name:
            self.file_path_input.setText(file_name)

    def process_file(self, mode):
        file_path = self.file_path_input.text().strip()
        password = self.password_input.text().strip()
        do_obfuscate = self.obfuscate_checkbox.isChecked()

        if not file_path:
            QMessageBox.warning(self, "خطا", "لطفاً ابتدا یک فایل انتخاب کنید.")
            return

        if not password:
            QMessageBox.warning(self, "خطا", "لطفاً رمز عبور را وارد کنید.")
            return

        self.toggle_buttons(False)
        self.status_label.setText("در حال پردازش فایل...")

        self.worker = CryptoWorker(mode, file_path, password, do_obfuscate)
        self.worker.finished.connect(self.on_process_finished)
        self.worker.start()

    def on_process_finished(self, success, message):
        self.toggle_buttons(True)
        self.status_label.setText("")
        
        if success:
            QMessageBox.information(self, "موفقیت", message)
            self.password_input.clear()
        else:
            QMessageBox.critical(self, "خطا", message)

    def toggle_buttons(self, enabled):
        self.encrypt_btn.setEnabled(enabled)
        self.decrypt_btn.setEnabled(enabled)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = DarkCryptoApp()
    window.show()
    sys.exit(app.exec())