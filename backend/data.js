// Initial mock data for the Yellow Pages application

const categories = [
    { id: 1, icon: 'restaurant', name: 'Restaurants', count: '1,420 businesses' },
    { id: 2, icon: 'directions_car', name: 'Automotive', count: '840 businesses' },
    { id: 3, icon: 'home_repair_service', name: 'Home Repair', count: '2,105 businesses' },
    { id: 4, icon: 'content_cut', name: 'Beauty & Spa', count: '642 businesses' },
    { id: 5, icon: 'medical_services', name: 'Health', count: '931 businesses' },
    { id: 6, icon: 'shopping_bag', name: 'Shopping', count: '1,850 businesses' },
    { id: 7, icon: 'nightlife', name: 'Nightlife', count: '245 businesses' },
    { id: 8, icon: 'school', name: 'Education', count: '112 businesses' },
];

let businesses = [
    {
        id: 1,
        name: 'Elite Flow Plumbing Solutions',
        category: 'Home Repair',
        rating: 4.9,
        reviews: 128,
        address: '123 Industrial Way, Springfield, IL',
        phone: '(555) 123-4567',
        status: 'Open until 8:00 PM',
        isVerified: true,
        isFeatured: false,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvihKmFUiQj_tMoo5zQobck0dMS5XRZ9v7CwfqdiaspxWUtlMkMJ98LNTWTZCj6ShE4HK38fYNrE4QLpnFPt1YYFEN9AUaP5RV6zvLVsSoYP7Y5NlvFlfDc2Kz9xmJs2dUJgTdk-VjhoZGqoUFhD4uLw_fNXY_q08MWaXdWFv0pZz8dwL5ExQEZeZ-sHzfS_BG3zQKfFpFtAiGI6-qSaymcuFQHPed3TyyJoKfy9eykuCsGdzWVjzBCpr2JTZSu_ZzWoiVAdXt9PQ'
    },
    {
        id: 2,
        name: 'The Golden Fork Bistro',
        category: 'Restaurants',
        rating: 4.7,
        reviews: 342,
        address: '892 Culinary Blvd, Springfield, IL',
        phone: '(555) 987-6543',
        status: 'Closes in 20 mins',
        isVerified: false,
        isFeatured: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYHn-EhD08DuFsHADNjdV8ypdimGNgowl4yHpxznPIMDSXWO60pQzDD3y3ol5rbsc-Cz7tA_Zybz1L3cFr8worXz0crUL-jaDZ-ZemMXY_Mhj7ng0wFp5H7vGNKK24RQ8WmgedLPCjTw8yjqCTpMsdX-iyTNJww7-s1E2wE1wWLFFMPVJUp48CW-dKnNa8I15IKpt3gBuqPweDEox9bmONMA_mPa9IxKryWAt0Y7Ivm8FlCkcho38i76lVbQE72UgM8Bw-0_YlMFA'
    },
    {
        id: 3,
        name: 'Precision Auto Works',
        category: 'Automotive',
        rating: 4.5,
        reviews: 89,
        address: '44 Mechanic Ln, Springfield, IL',
        phone: '(555) 444-2222',
        status: '15+ years in business',
        isVerified: true,
        isFeatured: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB29duBT3rbvPMCnkw9JREZ1SANwk6gDW_Cr7M2zDS3bNuhDHee8Uw19TPMrDJcZpzHTEaDKMpZ4OlW4JzELPWFsnukkoYJaxImEN0Lrb2MMtzI59d29FQW46HOq7i8CEZfe41fq_MMKdhPiA3e-aVFRogEsSBlgGnskOa-nQozidLDf81gBXCzECczm90jLF0QXTlIvTJhVbUomjvsni2M1w1kRSyu6VQP0Or39gxRHkmVS-uSyB7x56Bonn5B8TOlh7G1P2L9jfE'
    },
    {
        id: 4,
        name: 'Le Bistro Modern',
        category: 'Restaurants',
        rating: 4.9,
        reviews: 1200,
        address: '245 West 42nd St, NY',
        phone: '(555) 111-2345',
        status: 'Open until 11:00 PM',
        isVerified: true,
        isFeatured: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFc9IoQYi3ovPc4bEfBWbnep6x__EpzhCMgKvukBcW6bvfPzi4QW4nJhZHcD4HWOKSqEQO7R-4EBrX7QEG5ZowHPQIGctUt3AC-H_iz0FX1yCq2WGyI9EvIB74Gwqt6FoxCKlrSrFw5pbO520PkQCRGQqe7ukP0m_a4INS_5-v9bya1lsD3d3t1mrlyJpocKtF8G7cjgFgEMs5oP052CI5XS2ZYMFEV2gCcUxywKs8o6AWDP_PlyKudicwZtNBJ6bteTtcotIZuJA'
    },
    {
        id: 5,
        name: 'Iron Core Gym',
        category: 'Health',
        rating: 4.7,
        reviews: 850,
        address: '89 Broadway, Brooklyn, NY',
        phone: '(555) 222-3456',
        status: '24/7 Access',
        isVerified: true,
        isFeatured: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJurMLLmR9-1Tk2Z_H93tm-zfR9O21ySav-ph7_yk90stgoHadyN5Zke5P2RDi8j87X0QQpI-SiyDpIoA_n6dxq4Xoof44GyDLRaIeKsq9LNhTiESBkHOUBe44ohAbxGahOi--q70p3MbcbGc2be2hKyR1UI-qezEY_ymhd6NfQK62vSxyKNlo92XYrp2ltb6whXql5fVWMzmFlg-m9YJcZAdJlY_dJlWRITobIu7AGea_SbdMb8j4aBUDtz3fmli6Av6v8TADVUc'
    },
    {
        id: 6,
        name: 'Velvet Cut Studio',
        category: 'Beauty & Spa',
        rating: 5.0,
        reviews: 520,
        address: '52 Madison Ave, NY',
        phone: '(555) 333-4567',
        status: 'Booking Available',
        isVerified: true,
        isFeatured: false,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnho9OsC-lv9BU6e7qJTr1yok-3ttHCc1sezozaRTZae-6rQFha0bmd6LYEYxB40pDFulicfd5gwGmOe1LB2QB0FDTQ65dpI2JCbhGqSuZpMvkb1wQf5drsqOWHSD3CwsimowNlPxb8ReQnkZHXB6Eh8gpoL4BszeXFlkGKhXy5MGdYZeVqaTZ4qbrw0La7oKbuMusf5cA6zQ_zI9kgW9B2czdWIF-bexZXuMcszrDW5YcuTz89O_MvgNvN_Vsvoq6hbUEOIhJlTg'
    }
];

module.exports = {
    categories,
    businesses,
    addBusiness: (business) => {
        const newBusiness = {
            ...business,
            id: businesses.length > 0 ? Math.max(...businesses.map(b => b.id)) + 1 : 1,
            rating: 0,
            reviews: 0,
            status: 'Newly Added',
            isVerified: false,
            isFeatured: false,
            image: business.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
        };
        businesses.push(newBusiness);
        return newBusiness;
    }
};
