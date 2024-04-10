import { styles } from "@/app/styles/style";
import Image from "next/image";
import React from "react";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

export const reviews = [
  {
    name: "손태권",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "수강생",
    comment:
      "이 강의는 게임 초보자부터 중급자까지 모두에게 유익한 내용을 담고 있습니다. 강사는 게임의 기본적인 조작 방법부터 시작해, 전략 구상과 실행에 이르기까지 단계별로 설명을 잘 해주셔서 따라 하기 쉬웠습니다. 특히 실전에서 바로 적용 가능한 팁들이 많아서 좋았어요.",
  },
  {
    name: "손순자",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profession: "수강생",
    comment:
      "정말 심도 있는 분석과 함께 제공되는 이 강의는 게임을 새로운 시각으로 바라보게 해줍니다. 강사는 복잡한 게임 메커니즘을 쉽게 풀어 설명하며, 플레이어가 게임 내에서 더 나은 결정을 내릴 수 있도록 돕습니다. 개인적으로 게임을 통한 문제 해결 능력이 향상되었다고 느꼈어요.",
  },
  {
    name: "손규민",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    profession: "수강생",
    comment:
      "이 강의는 게임의 세계로 빠르게 빠져들게 만듭니다. 강사의 명확한 설명 덕분에 게임의 깊이 있는 이해를 할 수 있었고, 이론적인 지식과 실제 게임플레이 사이의 균형을 잘 맞추고 있습니다. 또한, 강의에서 제공되는 여러 예시와 팁은 게임을 더 잘 이해하고 즐기는 데 큰 도움이 되었습니다.",
  },
  {
    name: "최고민수",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    profession: "수강생",
    comment:
      "게임에 대한 열정이 있고 실력을 한 단계 업그레이드하고 싶은 사람이라면 이 강의를 꼭 들어야 합니다. 강사는 플레이어가 흔히 저지르는 실수들과 이를 피하기 위한 전략을 제공하여, 보다 전략적으로 게임에 접근할 수 있도록 도와줍니다. 저는 이 강의 덕분에 좋아하는 게임에서 큰 성과를 거둘 수 있었습니다.",
  },
  {
    name: "엄준신",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    profession: "수강생",
    comment:
      "이 강의는 게임 플레이의 모든 측면을 다루며, 특히 게임 내 결정의 중요성과 그 영향에 대해 깊이 있게 다룹니다. 강사의 전문적인 지식과 실제 게임에서의 경험이 잘 조화되어 있어, 게임을 보는 시각을 넓히는 데 매우 유용했습니다. 더불어, 강의는 매우 재미있으며 시간 가는 줄 모르고 들었습니다.",
  },
];

const Reviews = (props: Props) => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
        <div className="800px:w-[50%] w-full">
          <Image
            src={require("../../../public/assets/banner-img-1.png")}
            alt="business"
            width={700}
            height={700}
          />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            우리 수강생들은 <span className="text-gradient">우리의 힘</span>{" "}
            <br /> 리뷰를 확인해 보세요!
          </h3>
          <br />
        </div>
        <br />
        <br />
      </div>
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-20px]">
        {reviews &&
          reviews.map((i, index) => <ReviewCard item={i} key={index} />)}
      </div>
    </div>
  );
};

export default Reviews;
