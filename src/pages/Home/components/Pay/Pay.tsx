import React, { FC, useMemo, useState } from "react";
import { Card, Input, InputNumber, Space } from "antd";
import FormC, { FieldProps } from "@/components/FormC/FormC";
import { ProductType } from "@/mockData";
interface PayProps {
  data?: any;
}

const Pay: FC<PayProps> = React.memo(({ data }) => {
  const [type_pay, setType_pay] = useState(2);
  const [refund, setRefund] = useState<number>(0);

  const total = useMemo(() => {
    return (
      data?.reduce((acc: number, item: ProductType) => {
        const { type: type_discount, value: discount = 0 } =
          item?.active_discount || {};
        const total_price_product =
          type_discount === "percent"
            ? item.product_price * item.product_quantity * (1 - discount / 100)
            : item.product_price * item.product_quantity - discount;
        return acc + total_price_product;
      }, 0) || 0
    );
  }, [data]);

  const handleCalcRefund = () => {
    if (refund > total) {
      return refund - total;
    }
    return 0;
  };

  const formFields: FieldProps[] = [
    {
      name: "type_pay",
      type: "radio",
      label: "Thanh toán bằng",
      options: [
        {
          title: "Tiền mặt",
          value: 1,
        },
        {
          title: "Chuyển khoản",
          value: 2,
        },
      ],
      onChange: (name: string, value: any) => {
        setType_pay(parseInt(value));
        if (value == "2") {
          setRefund(0);
        }
      },
      rules: [{ required: true, message: "Please select" }],
    },
  ];

  return (
    <Space direction="vertical" size={16}>
      <Card style={{ width: 500 }}>
        <h1 className="text-lg mb-2 font-bold">Thông tin thanh toán</h1>
        <FormC
          initData={{
            type_pay: 2,
          }}
          chunkSize={1}
          fields={formFields}
        />
        <div className="mb-3 flex gap-3 items-center">
          <span>Tổng tiền:</span>
          <span className="text-lg font-bold">
            {total.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </div>
        {type_pay == 1 && (
          <div>
            <span>Tiền khách đưa:</span>
            <span>
              <InputNumber
                min={0}
                onChange={(value) => {
                  setRefund(value ?? 0);
                }}
                className="w-full"
                formatter={(value) =>
                  `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                placeholder="Nhập số tiền khách đưa"
              />
            </span>
          </div>
        )}
        <div className=" flex items-center gap-1">
          <span>Tiền thối cho khách:</span>
          <span className="font-bold">
            {handleCalcRefund().toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </div>
      </Card>
    </Space>
  );
});

export default Pay;
