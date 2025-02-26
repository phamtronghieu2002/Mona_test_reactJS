import FormC, { FieldProps } from "@/components/FormC/FormC";
import { Button } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";
import data, { ProductType } from "@/mockData";
import TableC from "@/components/TableC/TableC";
import column from "@/pages/Home/components/CreateOrder/Column";
import ModalConfirmOrder from "@/components/Modal/ModalConfirmOrder";
import Pay from "@/pages/Home/components/Pay/Pay";

interface CreateOrderProps {}
export interface OrderContextProps {
  productSelect: ProductType[];
  setProductSelect: React.Dispatch<React.SetStateAction<ProductType[]>>;
}

export const OrderContext = React.createContext<OrderContextProps | undefined>(
  undefined
);
const CreateOrder: FC<CreateOrderProps> = () => {
  const [products, setProduct] = useState<ProductType[]>([]);
  const [productSelect, setProductSelect] = useState<ProductType[]>([]);
  const [formData, setFormData] = useState<any>(null);

  const handleChooseProduct = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const existProduct = productSelect.find((p) => p.id === productId);
      if (!existProduct) {
        const newProductSelect = [...productSelect, product];
        setProductSelect(newProductSelect);
      }
      return;
    }
  };

  const formFields: FieldProps[] = [
    {
      name: "customer_name",
      type: "input",
      label: "Tên khách hàng",
      placeholder: " Nhập tên khách hàng",
      onChange: (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
      },
      rules: [{ required: true, message: "Please input your customer name!" }],
    },

    {
      name: "email",
      type: "input",
      label: "Email",
      placeholder: "Nhập email",
      onChange: (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
      },
      rules: [
        { required: true, message: "Please input your email!" },
        { type: "email", message: "The input is not valid E-mail!" },
      ],
    },

    {
      name: "phone",
      type: "input",
      label: "Số điện thoại",
      onChange: (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
      },
      placeholder: "Nhập số điện thoại",
      rules: [{ required: true, message: "Please input your phone number!" }],
    },
    // select option
    {
      name: "product_select",
      type: "select",
      label: "Sản phẩm",
      placeholder: "Chọn sản phẩm",
      options: products.map((product: any) => ({
        title: product.product_name,
        value: product.id,
      })),
      onChange: (name: string, value: string) => {
        handleChooseProduct(Number(value));
      },
      rules: [{ required: true, message: "Please select your product!" }],
    },
  ];

  const fetchProduct = () => {
    setProduct(data.products);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  console.log("====================================");
  console.log("cart>>:", productSelect);
  console.log("====================================");
  console.log("====================================");
  console.log("customer_infor>>:", formData);
  console.log("====================================");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (data: any) => {
    setFormData(data);
  };

  return (
    <OrderContext.Provider value={{ productSelect, setProductSelect }}>
      <h1 className="text-2xl text-center mb-10">Tạo đơn hàng</h1>
      <div className="form-order flex row">
        <div className="col-md-3 border p-3">
          <div className="content">
            <FormC
              onSubmit={handleSubmit}
              chunkSize={1}
              ref={buttonRef}
              fields={formFields}
            />
          </div>
        </div>
        <div className="col-md-9 border">
          <TableC
            dataSource={productSelect.map((product) => ({
              ...product,
              key: product.id,
            }))}
            columns={column(productSelect, setProductSelect)}
          />

          <div className="pay_information flex justify-end mb-5 mt-3">
            <Pay data={productSelect} />
          </div>
        </div>
        <div className="actions flex justify-end mt-3">
          <div>
            <ModalConfirmOrder
              title="xác nhận thanh toán"
              data={formData}
              button={
                <Button
                  disabled={
                    !formData?.customer_name ||
                    !formData?.email ||
                    !formData?.phone ||
                    productSelect.length === 0
                  }
                  type="primary"
                >
                  Thanh toán
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </OrderContext.Provider>
  );
};

export default CreateOrder;
