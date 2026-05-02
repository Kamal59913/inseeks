import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDownIcon } from "../../../icons";
import { useSidebar } from "../../../context/SidebarContext";
import { MdOutlineEdit } from "react-icons/md";
import { useModalData } from "../../../redux/hooks/useModal";

interface CategoryAccordionProps {
  name: string;
  subcategories: any[];
  category_id: string;
  isActive: boolean;
  onToggle: () => void;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  category_id,
  name,
  subcategories,
  isActive,
  onToggle,
}) => {
  const { isExpanded, isHovered } = useSidebar();
  const location = useLocation();
  const { open } = useModalData();
  const [subMenuHeight, setSubMenuHeight] = useState<number>(0);
  const subMenuRef = useRef<HTMLDivElement>(null);

  const isActiveSubcategory = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // Auto-open logic for active subcategory
  useEffect(() => {
    if (subcategories) {
      const activeSubItem = subcategories.find(subItem => isActiveSubcategory(subItem.path));
      if (activeSubItem && !isActive) {
        onToggle();
      }
    }
  }, [location, isActiveSubcategory, subcategories, isActive, onToggle]);

  // Height calculation effect
  useEffect(() => {
    if (subMenuRef.current) {
      setSubMenuHeight(isActive ? subMenuRef.current.scrollHeight : 0);
    }
  }, [isActive]);

  const data = {
    _id: category_id,
    name,
    subcategories  };

  return (
    <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <div className="flex flex-col gap-4">
        <div>
          <ul className="flex flex-col gap-4">
            <li>
              <button
                onClick={onToggle}
                className={`menu-item group py-[10px] ${
                  isActive ? "menu-item-active-primary" : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span className="menu-item-text">{name}</span>
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    isActive ? "rotate-180 text-primary-dark" : ""
                  }`}
                />
                <MdOutlineEdit onClick={() => open("edit-category", data)} />
              </button>

              {subcategories && (
                <div
                  ref={subMenuRef}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height: `${subMenuHeight}px`,
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {subcategories.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`menu-dropdown-item ${
                            isActiveSubcategory(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          {/* <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActiveSubcategory(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  isActiveSubcategory(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span> */}
                          <span className="ml-auto hover:text-primary">
                            <MdOutlineEdit
                              onClick={() =>{
                                const data = {
                                  _id: subItem?._id,
                                  name: subItem?.name,
                                  type: 'subcategory'
                                };
                                open("edit-subcategory", data)
                              }
                              }
                            />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryAccordion;