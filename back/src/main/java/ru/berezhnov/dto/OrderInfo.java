package ru.berezhnov.dto;

import java.util.Date;
import java.util.List;

public class OrderInfo {
    private OrderImportant orderImportant;
    private UserImportant userImportant;
    private AdminImportant adminImportant;
    private List<CartStateDTO> orderBooks;

    public static class OrderImportant {
        private String id;
        private Integer number;
        private Date date;
        private String address;
        private Double totalCost;
        private String paymentMethod;
        private String status;
        private Date dateModified;
        private String message;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public Integer getNumber() {
            return number;
        }

        public void setNumber(Integer number) {
            this.number = number;
        }

        public Date getDate() {
            return date;
        }

        public void setDate(Date date) {
            this.date = date;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public Double getTotalCost() {
            return totalCost;
        }

        public void setTotalCost(Double totalCost) {
            this.totalCost = totalCost;
        }

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Date getDateModified() {
            return dateModified;
        }

        public void setDateModified(Date dateModified) {
            this.dateModified = dateModified;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class UserImportant {
        private String name;
        private String surname;
        private String phone;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getSurname() {
            return surname;
        }

        public void setSurname(String surname) {
            this.surname = surname;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }

    public static class AdminImportant {
        private String name;
        private String surname;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getSurname() {
            return surname;
        }

        public void setSurname(String surname) {
            this.surname = surname;
        }
    }

    public OrderImportant getOrderImportant() {
        return orderImportant;
    }

    public void setOrderImportant(OrderImportant orderImportant) {
        this.orderImportant = orderImportant;
    }

    public UserImportant getUserImportant() {
        return userImportant;
    }

    public void setUserImportant(UserImportant userImportant) {
        this.userImportant = userImportant;
    }

    public AdminImportant getAdminImportant() {
        return adminImportant;
    }

    public void setAdminImportant(AdminImportant adminImportant) {
        this.adminImportant = adminImportant;
    }

    public List<CartStateDTO> getOrderBooks() {
        return orderBooks;
    }

    public void setOrderBooks(List<CartStateDTO> orderBooks) {
        this.orderBooks = orderBooks;
    }

    public OrderInfo(OrderImportant orderImportant, UserImportant userImportant, AdminImportant adminImportant, List<CartStateDTO> orderBooks) {
        this.orderImportant = orderImportant;
        this.userImportant = userImportant;
        this.adminImportant = adminImportant;
        this.orderBooks = orderBooks;
    }

    public OrderInfo() {
    }
}
