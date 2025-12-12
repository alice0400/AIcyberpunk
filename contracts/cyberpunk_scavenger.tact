import "@stdlib/deploy";

// --- Messages (OpCodes) ---
// เราใช้ตัวเลขระบุคำสั่ง เพื่อให้ง่ายต่อการส่งจาก Frontend
message(1) BuyGacha {
    amount: Int as uint32; // 1 or 20
}

message(2) Dispatch {
    robotId: Int as uint32;
    zoneId: Int as uint8;
}

message(3) Recall {
    robotId: Int as uint32;
}

message(4) Repair {
    robotId: Int as uint32;
}

message(5) EnterOmega {
    robotId: Int as uint32;
}

// --- Contract ---
contract CyberpunkScavenger with Deployable {
    
    owner: Address;
    
    // เก็บ Data ง่ายๆ เพื่อประหยัด Gas (ของจริงอาจต้องใช้ HashMap ที่ซับซ้อนกว่านี้)
    // ใน Demo นี้เราจะเน้นรับคำสั่งและปล่อย Event หรือโอนเงินคืน
    
    init(owner: Address) {
        self.owner = owner;
    }

    // 1. ซื้อกล่องสุ่ม
    receive(msg: BuyGacha) {
        let ctx: Context = context();
        let price: Int = ton("1");
        if (msg.amount >= 20) { price = ton("20"); }
        
        require(ctx.value >= price, "Not enough TON sent");

        // Logic สุ่มของจะเกิดขึ้นที่นี่
        // ใน Production จริง เราจะ Emit Event บอก Frontend ว่าได้อะไร
        // หรือส่ง NFT กลับไป (แต่ใน Demo นี้เรารับเงินแล้วจบ Process)
    }

    // 2. ส่งหุ่นไปขุด
    receive(msg: Dispatch) {
        // บันทึกสถานะว่า User นี้ส่งหุ่น ID นี้ไป Zone นี้
        // (ประหยัด Gas โดยการ Validate เฉยๆ)
    }

    // 3. เรียกหุ่นกลับ (รับรางวัล)
    receive(msg: Recall) {
        // คำนวณรางวัลตามเวลา
        // ส่ง TON Reward กลับไปให้ User
        // let reward: Int = ...;
        // send(SendParameters{
        //     to: sender(),
        //     value: reward, 
        //     mode: SendIgnoreErrors
        // });
    }

    // 4. เข้า Zone Omega
    receive(msg: EnterOmega) {
        // รับค่าธรรมเนียมเข้า 0.5 TON
        // สุ่ม Jackpot 5%
        let seed: Int = now() + randomInt();
        if (seed % 100 < 5) {
            // JACKPOT! ส่งรางวัลใหญ่กลับ
             if (myBalance() > ton("10")) {
                send(SendParameters{
                    to: sender(),
                    value: ton("10"), // สมมติรางวัล 10 TON
                    mode: SendIgnoreErrors
                });
             }
        }
    }

    // รับเงินเติมเข้า Contract (สำหรับเป็นกองกลางจ่ายรางวัล)
    receive("Deposit") {
        // รับเงินเฉยๆ
    }
}
