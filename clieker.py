import tkinter as tk
import threading
import time
import pyautogui

class DashClicker:
    def __init__(self, root):
        self.root = root
        self.root.title("Dash Clicker")
        self.root.geometry("1000x650")

        self.running = False
        self.count = 0
        self.max_circles = 10
        self.circles = []
        self.selected_circle = None
        self.selected_text = None
        self.last_x = 0
        self.last_y = 0

        top = tk.Frame(root)
        top.pack(fill="x", pady=10)

        tk.Button(top,text="Start",width=10,command=self.start_clicking).pack(side="left",padx=5)
        tk.Button(top,text="Stop",width=10,command=self.stop_clicking).pack(side="left",padx=5)

        self.add_btn = tk.Button(top,text="+",width=5,command=self.add_circle)
        self.add_btn.pack(side="left",padx=5)

        tk.Button(top,text="Delete",width=10,command=self.delete_all).pack(side="left",padx=5)

        self.canvas = tk.Canvas(root,bg="white",width=980,height=560)
        self.canvas.pack()

        self.canvas.bind("<Button-1>", self.start_drag)
        self.canvas.bind("<B1-Motion>", self.drag)
        self.canvas.bind("<ButtonRelease-1>", self.stop_drag)

    def add_circle(self):
        if self.count >= self.max_circles:
            self.add_btn.config(state="disabled")
            return
        self.count += 1
        x = 60 + (self.count-1)*70
        y = 60
        c = self.canvas.create_oval(x,y,x+50,y+50,fill="skyblue")
        t = self.canvas.create_text(x+25,y+25,text=str(self.count))
        self.circles.append((c,t))
        if self.count >= self.max_circles:
            self.add_btn.config(state="disabled")

    def start_drag(self,event):
        item=self.canvas.find_closest(event.x,event.y)
        if not item: return
        clicked=item[0]
        for c,t in self.circles:
            if clicked in (c,t):
                self.selected_circle=c
                self.selected_text=t
                self.last_x=event.x
                self.last_y=event.y
                break

    def drag(self,event):
        if self.selected_circle is None: return
        dx=event.x-self.last_x
        dy=event.y-self.last_y
        self.canvas.move(self.selected_circle,dx,dy)
        self.canvas.move(self.selected_text,dx,dy)
        self.last_x=event.x
        self.last_y=event.y

    def stop_drag(self,event):
        self.selected_circle=None
        self.selected_text=None

    def start_clicking(self):
        if self.running: return
        self.running=True
        threading.Thread(target=self.auto_click,daemon=True).start()

    def stop_clicking(self):
        self.running=False

    def delete_all(self):
        for c,t in self.circles:
            self.canvas.delete(c)
            self.canvas.delete(t)
        self.circles.clear()
        self.count=0
        self.add_btn.config(state="normal")

    def auto_click(self):
        while self.running:
            for c,t in self.circles:
                if not self.running:
                    break
                x1,y1,x2,y2=self.canvas.coords(c)
                x=self.root.winfo_rootx()+int((x1+x2)/2)
                y=self.root.winfo_rooty()+int((y1+y2)/2)
                pyautogui.click(x,y)
            time.sleep(0.01)

root=tk.Tk()
DashClicker(root)
root.mainloop()
