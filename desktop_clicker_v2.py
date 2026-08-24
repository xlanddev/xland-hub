import tkinter as tk
import threading,time
try:
    import pyautogui
except:
    pyautogui=None

class DashClicker:
    def __init__(self,root):
        self.root=root
        root.title("Desktop Clicker")
        root.geometry("299x120")
        self.windows=[]
        self.history=[]
        self.running=False

        bar=tk.Frame(root);bar.pack(pady=10)
        tk.Button(bar,text="Start",command=self.start_clicking).pack(side="left",padx=4)
        tk.Button(bar,text="Stop",command=self.stop_clicking).pack(side="left",padx=4)
        tk.Button(bar,text="+",command=self.create_circle).pack(side="left",padx=4)
        tk.Button(bar,text="Delete",command=self.delete_all).pack(side="left",padx=4)
        tk.Button(bar,text="History",command=self.show_history).pack(side="left",padx=4)

    def create_circle(self):
        n=len(self.windows)+1
        w=tk.Toplevel(self.root)
        w.overrideredirect(True);w.attributes("-topmost",True)
        w.geometry(f"60x60+{220+n*20}+{220+n*20}")
        c=tk.Canvas(w,width=60,height=60,highlightthickness=0);c.pack()
        c.create_oval(5,5,55,55,fill="skyblue")
        c.create_text(30,30,text=str(n))
        def s(e):w._x=e.x;w._y=e.y
        def d(e):
            x=w.winfo_x()+e.x-w._x;y=w.winfo_y()+e.y-w._y
            w.geometry(f"60x60+{x}+{y}")
        c.bind("<Button-1>",s);c.bind("<B1-Motion>",d)
        self.windows.append((w,c))
        self.history.append(f"Circle {n} created")

    def start_clicking(self):
        if self.running:return
        self.running=True
        threading.Thread(target=self.auto_click,daemon=True).start()

    def stop_clicking(self):
        self.running=False

    def auto_click(self):
        while self.running:
            if pyautogui:
                for w,_ in self.windows:
                    if not self.running: break
                    x=w.winfo_x()+30;y=w.winfo_y()+30
                    pyautogui.click(x,y)
            time.sleep(0.02)

    def delete_all(self):
        for w,_ in self.windows:
            w.destroy()
        self.windows.clear()
        self.history.append("Deleted all circles")

    def show_history(self):
        h=tk.Toplevel(self.root)
        h.title("History")
        t=tk.Text(h,width=40,height=10)
        t.pack()
        for i in self.history:
            t.insert("end",i+"\n")
        t.config(state="disabled")

root=tk.Tk()
DashClicker(root)
root.mainloop()
