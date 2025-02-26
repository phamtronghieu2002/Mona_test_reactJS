// STT,TEN SP,DON GIA,SO LUONG,MA KHUYEN MAI,DON GIA

import ModalConfirm from "@/components/Modal/ModalConfirm";
import { ProductType } from "@/mockData";
import { Button, Form, InputNumber, Select, TableProps } from "antd";
import { Dispatch, SetStateAction } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { Tooltip } from "antd";
import { toast } from "react-toastify";

const column = (
  product: ProductType[],
  setProduct: Dispatch<SetStateAction<ProductType[]>>,
  isCofirm?: boolean
) => {
  return [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (_: any, record: any, index: any) => index + 1,
    },
    {
      title: "Tên SP",
      dataIndex: "product_name",
      key: "product",
    },
    {
      title: "Đơn giá",
      dataIndex: "product_price",
      key: "price",
      render: (value: any, record: any, index: any) => (
        <Form
          className="flex items-center"
          initialValues={{
            product_price: value,
          }}
        >
          <Form.Item
            className="m-0 w-full"
            name="product_price"
            //   số phải dương
          >
            <InputNumber
              disabled={isCofirm ? true : false}
              className="w-full"
              min={0}
              formatter={(value) =>
                `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              onChange={(value) => {
                product[index].product_price = Number(value);

                setProduct([...product]);
              }}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "product_quantity",
      key: "product_quantity",
      render: (value: any, record: any, index: any) => (
        <Form
          className="flex items-center"
          initialValues={{
            product_quantity: value,
          }}
        >
          <Form.Item
            className="m-0 w-full"
            name="product_quantity"
            //   số phải dương
          >
            <InputNumber
              disabled={isCofirm ? true : false}
              min={1}
              onChange={(value) => {
                product[index].product_quantity = Number(value);

                setProduct([...product]);
              }}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Mã Khuyến mãi",
      dataIndex: "discounts",
      key: "discounts",
      render: (value: any, record: any, index: any) => (
        <Form
          className="flex items-center"
          initialValues={{
            product_discount_id: value,
          }}
        >
          <Form.Item
            className="m-0 w-full"
            name="product_discount_id"
            //   số phải dương
          >
            <Select
              disabled={isCofirm ? true : false}
              onChange={(value) => {
                product[index].active_discount = product[index].discounts.find(
                  (item) => item.id === value
                );
                setProduct([...product]);
                if (product[index].active_discount) {
                  toast.success(`đã áp dụng mã khuyến mãi giảm ${product[index].active_discount.type === "percent" ? product[index].active_discount.value + "%" : product[index].active_discount.value + " đ"}`);
                }
              }}
            >
              {record.discounts.map((option: any, index: any) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.id}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    isCofirm
      ? {}
      : {
          title: "Thao tác",
          dataIndex: "actions",
          key: "remove",
          render: (value: any, record: any, index: any) => (
            <ModalConfirm
              button={
                <Tooltip title="Xóa sản phẩm">
                  <Button type="dashed" icon={<FaRegTrashAlt />}></Button>
                </Tooltip>
              }
              title="bạn chắc chắn muốn xóa sản phẩm khỏi đơn hàng ?"
              callback={() => {
                setProduct(
                  product.filter((item, index) => item.id !== record.id)
                );
                toast("xóa sản phẩm thành công! ")
              }}
            />
          ),
        },
  ];
};

export default column;
